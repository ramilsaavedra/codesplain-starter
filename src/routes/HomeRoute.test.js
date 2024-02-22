import { screen, render } from "@testing-library/react"
import { createServer } from "../test/server"
import { MemoryRouter } from "react-router"
import HomeRoute from "./HomeRoute"

createServer([
  {
    path: "/api/repositories",
    method: "get",
    res: (req, res, ctx) => {
      const language = req.url.searchParams.get("q").split("language:")[1]
      return {
        items: [
          { id: 1, full_name: `${language}_one` },
          { id: 2, full_name: `${language}_two` },
        ],
      }
    },
  },
])

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
