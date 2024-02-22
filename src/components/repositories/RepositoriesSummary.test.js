import { screen, render } from "@testing-library/react"
import RepositoriesSummary from "./RepositoriesSummary"

test("display the primary language of the repo", () => {
  const repository = {
    language: "Javascript",
    targazers_count: 1,
    open_issues: 1,
    forks: 1,
  }
  render(<RepositoriesSummary repository={repository} />)

  const language = screen.getByText("Javascript")

  expect(language).toBeInTheDocument()
})
