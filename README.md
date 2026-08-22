# Iss

<a alt="Nx logo" href="https://nx.dev" target="_blank" rel="noreferrer"><img src="https://raw.githubusercontent.com/nrwl/nx/master/images/nx-logo.png" width="45"></a>

✨ Your new, shiny [Nx workspace](https://nx.dev) is ready ✨.

[Learn more about this workspace setup and its capabilities](https://nx.dev/getting-started/intro#learn-nx?utm_source=nx_project&amp;utm_medium=readme&amp;utm_campaign=nx_projects) or run `npx nx graph` to visually explore what was created. Now, let's get you up to speed!

## Run tasks

To run tasks with Nx use:

```sh
npx nx <target> <project-name>
```

For example:

# Intelligent Systems Suite

ISS is an Nx monorepo for exploring AI-assisted software systems with explicit platform boundaries, operational evidence, and human-directed workflows.

The current repository is a validated platform foundation and reference shell. It is not yet the complete future suite described by the roadmap documents.

## Architecture

Applications consume shared platform capabilities through stable public APIs:

```text
Applications
	-> AI Provider
		-> Telemetry

Applications
	-> Component Kernel
		-> Design Tokens
```

Current projects:

| Project | Location | Current state |
| --- | --- | --- |
| Design Tokens | `libs/platform/design-tokens` | Validated v1.0 foundation |
| Component Kernel | `libs/platform/component-kernel` | Frozen v1.0, human approved |
| Telemetry | `libs/platform/telemetry` | Frozen v1.0, engineering approved |
| AI Provider | `libs/platform/ai-provider` | Completed v1.0; browser demo remains offline |
| Application Shell | `apps/shell` | Active reference integration |

PRD-06 and PRD-07 remain planned roadmap applications. Their directories are not present in the current workspace.

## Prerequisites

- Node.js compatible with the versions declared by the workspace toolchain
- pnpm

Install dependencies with:

```sh
pnpm install
```

## Development

Run the browser shell with:

```sh
CI=1 pnpm nx serve shell
```

The shell demonstrates the component kernel and AI Provider boundary. The
browser demo uses the explicit `demo-key` sentinel and returns deterministic
offline responses. Runtime configurations with a real API key use the live
OpenAI adapter; credentials must remain outside browser bundles.

Run any Nx target with:

```sh
pnpm nx <target> <project>
```

## Validation

Pull requests and pushes to `main` run the same focused validation through
[`.github/workflows/ci.yml`](.github/workflows/ci.yml).

Focused project targets:

```sh
pnpm nx lint design-tokens
pnpm nx test design-tokens
pnpm nx build design-tokens

pnpm nx lint component-kernel
pnpm nx test component-kernel
pnpm nx build component-kernel

pnpm nx lint telemetry
pnpm nx test telemetry
pnpm nx build telemetry

pnpm nx lint ai-provider
pnpm nx test ai-provider
pnpm nx build ai-provider

pnpm nx lint shell
pnpm nx test shell
pnpm nx build shell
```

The shell has an existing CSS warning-budget warning in `apps/shell/src/app/app.css`; it is unrelated to the documentation cleanup.

The Design Tokens lint, test, and build targets validate the shared CSS asset
contract.

## Documentation

Start with the [documentation index](docs/README.md). It links to architecture standards, engineering governance, design material, product mini-PRDs, and archived engineering-brick records.

Repository-wide Copilot instructions live at [github/copilot-instructions.md](github/copilot-instructions.md).

## Repository conventions

- Keep dependency direction from applications into platform libraries.
- Route AI execution through the AI Provider boundary.
- Keep telemetry provider-neutral and local-first.
- Preserve stable public contracts and document breaking changes.
- Validate focused Nx targets before broader validation.
- Commit messages follow the repository's Conventional Commit style.
- [Our blog](https://nx.dev/blog?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
