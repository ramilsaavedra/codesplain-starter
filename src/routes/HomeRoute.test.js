import { screen, render } from "@testing-library/react"
import { setupServer } from "msw/node"
import { rest } from "msw"
import { MemoryRouter } from "react-router"
import HomeRoute from "./HomeRoute"

const handlers = [
  rest.get("/api/repositories", (req, res, ctx) => {
    const language = req.url.searchParams.get("q").split("language:")[1]

    return res(
      ctx.json({
        items: [
          {
            id: 1,
            full_name: `${language}_one`,
          },
          {
            id: 2,
            full_name: `${language}_two`,
          },
        ],
      })
    )
  }),
]

const server = setupServer(...handlers)

beforeAll(() => {
  server.listen()
})

afterEach(() => {
  server.resetHandlers()
})

afterAll(() => {
  server.close()
})

function renderComponent() {
  render(
    <MemoryRouter>
      <HomeRoute />
    </MemoryRouter>
  )
}

async function pause(resolve) {
  await new Promise((res) => setTimeout(res, 100))
}

test("shows two links for each languge", async () => {
  const languages = ["javascript", "typescript", "rust", "go", "java", "python"]

  renderComponent()

  for (let language of languages) {
    const links = await screen.findAllByRole("link", {
      name: new RegExp(`${language}_`, "i"),
    })

    expect(links).toHaveLength(2)
    expect(links[0]).toHaveTextContent(`${language}_one`)
    expect(links[1]).toHaveTextContent(`${language}_two`)
    expect(links[0]).toHaveAttribute("href", `/repositories/${language}_one`)
    expect(links[0]).toHaveAttribute("href", `/repositories/${language}_one`)
  }
})
