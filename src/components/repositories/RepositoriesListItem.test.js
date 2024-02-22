import { screen, render, act } from "@testing-library/react"
import { MemoryRouter } from "react-router"
import RepositoriesListItem from "./RepositoriesListItem"

function renderComponent() {
  const repository = {
    full_name: "facebook/react",
    language: "Javascript",
    description: "A js library",
    owner: {
      login: "facebook",
    },
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

test("shows a link to the github homepage for this repo", async () => {
  const { html_url } = renderComponent()

  await screen.findByRole("img", {
    name: "Javascript",
  })

  const link = screen.getByRole("link", { name: /github repository/ })
  expect(link).toHaveAttribute("href", html_url)
})

test("shows a fileicon with the appropriate icon", async () => {
  renderComponent()

  const icon = await screen.findByRole("img", {
    name: "Javascript",
  })

  expect(icon).toHaveClass("js-icon")
})

test("shows a link to the code editor page", async () => {
  const { repository } = renderComponent()

  await screen.findByRole("img", {
    name: "Javascript",
  })

  const link = await screen.findByRole("link", {
    name: new RegExp(repository.owner.login),
  })

  expect(link).toHaveAttribute("href", `/repositories/${repository.full_name}`)
})
