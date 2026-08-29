# ISS Platform Current-State Diagram

This diagram captures the current hybrid model: isolated application boundaries with a lightweight demo hub for reviewer clarity.

## Platform and Boundary View

```mermaid
flowchart LR
  Reviewer[Reviewer] --> DemoHub[Shell: Demo Hub\nStart here: Signal System]

  subgraph BrowserApps[Browser app surfaces]
    Shell[Shell\nPlatform composition reference]
    SignalSystem[Signal System\nOperational signal review demo]
    InterpretationEngine[Interpretation Engine\nAI reasoning boundary]
  end

  subgraph ServerBoundary[Server-only boundary]
    SignalAPI[Signal API\nRead-only integration boundary]
  end

  subgraph SharedPlatform[Shared platform libraries]
    ComponentKernel[Component Kernel]
    AIProvider[AI Provider]
    Telemetry[Telemetry]
    DesignTokens[Design Tokens]
  end

  subgraph ExternalSources[External and runtime sources]
    GitHubActions[GitHub Actions API\nread-only workflow runs]
    ProviderRuntime[Provider runtime\nserver-side credentials]
    DemoFixtures[Deterministic fixture data]
  end

  DemoHub --> SignalSystem
  DemoHub --> Shell
  DemoHub --> InterpretationEngine
  DemoHub --> SignalAPI

  Shell --> ComponentKernel
  Shell --> AIProvider
  Shell --> Telemetry
  Shell --> DesignTokens

  InterpretationEngine --> ComponentKernel
  InterpretationEngine --> AIProvider
  InterpretationEngine --> Telemetry
  InterpretationEngine --> DesignTokens

  SignalSystem --> ComponentKernel
  SignalSystem --> Telemetry
  SignalSystem --> DesignTokens
  SignalSystem -->|/api/signals + /api/interpretations| SignalAPI

  SignalSystem -->|fallback mode| DemoFixtures

  SignalAPI -->|live signal source| GitHubActions
  SignalAPI -->|server-side interpretation| ProviderRuntime
```

## Signal System Source-State Labels

```mermaid
stateDiagram-v2
  [*] --> DemoFixture

  DemoFixture: Source: Demo fixture
  LiveAPI: Source: Live API
  GitHubActions: Source: GitHub Actions
  Unavailable: Source: Unavailable

  DemoFixture --> LiveAPI: API available
  LiveAPI --> GitHubActions: server source = github-actions
  LiveAPI --> Unavailable: API error
  GitHubActions --> Unavailable: source failure
  Unavailable --> DemoFixture: safe fallback path
```

## Reviewer Notes

- Start in Shell, then open Signal System first.
- Keep architecture honest: app boundaries stay isolated.
- AI output remains support-only; human decision authority remains final.
