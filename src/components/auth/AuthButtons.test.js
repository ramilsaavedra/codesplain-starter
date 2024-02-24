import { render, screen } from "@testing-library/react"
import { MemoryRouter } from "react-router"
import { createServer } from "../../test/server"
import { SWRConfig } from "swr"

import AuthButton from "./AuthButtons"

async function renderComponent() {
  render(
    <SWRConfig value={{ provider: () => new Map() }}>
      <MemoryRouter>
        <AuthButton />
      </MemoryRouter>
    </SWRConfig>
  )

  await screen.findAllByRole("link")
}

async function pause() {
  await new Promise((res) => setTimeout(res, 100))
}

describe("when user is not signed in", () => {
  createServer([
    {
      path: "/api/user",
      method: "get",
      res: (res, req, ctx) => {
        return {
          user: null,
        }
      },
    },
  ])

  test("sign in and sign up are visiable", async () => {
    await renderComponent()

    const signIn = screen.getByRole("link", {
      name: /sign in/i,
    })

    const signUp = screen.getByRole("link", {
      name: /sign up/i,
    })

    expect(signIn).toBeInTheDocument()
    expect(signIn).toHaveAttribute("href", "/signin")
    expect(signUp).toBeInTheDocument()
    expect(signUp).toHaveAttribute("href", "/signup")
  })

  test("sign out is not visible", async () => {
    await renderComponent()

    const signOut = screen.queryByRole("link", {
      name: /sign out/i,
    })

    expect(signOut).not.toBeInTheDocument()
  })
})

describe("when user is signed in", () => {
  createServer([
    {
      path: "/api/user",
      method: "get",
      res: (res, req, ctx) => {
        return {
          user: {
            id: 1,
            email: "ramil@test.com",
          },
        }
      },
    },
  ])

  test("sign in sign up are not visible", async () => {
    await renderComponent()

    const signInBtn = screen.queryByRole("link", {
      name: /sign in/i,
    })

    const signUpBtn = screen.queryByRole("link", {
      name: /sign up/i,
    })

    expect(signInBtn).not.toBeInTheDocument()
    expect(signUpBtn).not.toBeInTheDocument()
  })

  test("sign out is visible", async () => {
    await renderComponent()

    const signOutBtn = screen.getByRole("link", {
      name: /sign out/i,
    })

    expect(signOutBtn).toBeInTheDocument()
    expect(signOutBtn).toHaveAttribute("href", "/signout")
  })
})
