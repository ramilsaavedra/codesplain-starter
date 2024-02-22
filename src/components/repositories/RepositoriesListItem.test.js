import { screen, render, act } from "@testing-library/react"
import { MemoryRouter } from "react-router"
import RepositoriesListItem from "./RepositoriesListItem"

// jest.mock("../tree/FileIcon", () => {
//   return () => {
//     return "File Icon Component"
//   }
// })

function renderComponent() {
  const repository = {
    full_name: "facebook/react",
    language: "Javascript",
    description: "A js library",
    owner: "facebook",
    name: "react",
    html_url: "https://github.com/ramilsaavedra/ramilsaavedra.com",
  }

  render(
    <MemoryRouter>
      <RepositoriesListItem repository={repository} />
    </MemoryRouter>
  )

  return { repository }
}

test("show a link to the github homepage for this repo", async () => {
  const { html_url } = renderComponent()

  await screen.findByRole("img", {
    name: "Javascript",
  })

  const link = screen.getByRole("link", { name: /github repository/ })
  expect(link).toHaveAttribute("href", html_url)
})
