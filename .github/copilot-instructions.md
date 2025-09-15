# State Machine Library with React Demo

TypeScript state machine library with React demonstration application using Bun runtime. The project implements a finite state machine (FSM) library and demonstrates it with two interactive examples: a multi-step registration form and an automated traffic light.

**Always reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.**

## Working Effectively

### Installation and Setup

- Install Bun runtime: `curl -fsSL https://bun.sh/install | bash`
- Source the environment: `source ~/.bashrc`
- Install dependencies: `bun install` -- takes ~15 seconds
- NEVER CANCEL: All build and test commands complete quickly (under 1 minute)

### Build and Test Commands

- Run tests: `bun test` -- takes ~10ms, 8 tests should pass
- Build for production: `bun run build` -- takes ~50ms, outputs to `dist/` directory
- Format code: `bun run prettier -- --write` -- takes ~600ms, formats all files
- Check formatting: `bun run prettier -- --check` -- takes ~600ms, exits with code 1 if formatting needed

### Development and Production Servers

- Development server: `bun dev` -- starts on http://localhost:3000, includes hot reload
- Production server: `bun start` -- starts on http://localhost:3000, uses production build

## Validation

### Manual Testing Requirements

**ALWAYS manually validate changes by running the application and testing both state machines:**

1. **Registration Form State Machine**:
   - Navigate to http://localhost:3000
   - Test personal details form (should allow "Next" when hasPersonalData guard passes)
   - Test address form navigation (back/next functionality)
   - Test confirmation step and submission

2. **Traffic Light State Machine**:
   - Observe automatic state transitions: red (5s) → green (2s) → yellow (1s) → red
   - Verify console logs show state entry/exit messages
   - Check visual state changes in the traffic light display

3. **Core Library Testing**:
   - Always run `bun test` after making changes to the state machine library
   - Verify all 8 tests pass: transitions, guards, entry/exit functions, error handling

### Formatting Requirements

- ALWAYS run `bun run prettier -- --write` before committing changes
- The build will fail if code is not properly formatted
- Prettier will format TypeScript, JSON, and Markdown files

## Project Structure and Navigation

### Key Directories

```
src/
├── lib/
│   ├── machine.ts          # Core FSM implementation
│   └── machine.test.ts     # Comprehensive test suite (8 tests)
├── machines/
│   ├── register.ts         # Registration form state machine definition
│   ├── robot.ts           # Traffic light state machine definition
│   └── index.ts           # State machine exports
├── pages/
│   ├── register/          # Registration form React component
│   └── robot/             # Traffic light React component
├── components/            # Reusable UI components (Card)
├── containers/           # Form step components (personal, address, confirmation)
├── App.tsx               # Main application component
└── index.tsx            # Bun server with hot reload
```

### Core State Machine API

- `FSM<State, Event, Guards>` - Generic finite state machine class
- `Machine<S, E, G>` - Type definition for machine configuration
- `State<S, G>` - State definition with optional guards
- `Transition<S, E, G>` - Transition configuration

### Important Files to Check After Changes

- Always test `src/lib/machine.ts` changes with `bun test`
- Always check `src/machines/*.ts` for state machine configurations
- Always validate React components in `src/pages/` with manual testing
- Always format code with `bun run prettier -- --write`

## Common Tasks Reference

### Development Workflow

1. Make code changes
2. Run `bun test` to verify core functionality
3. Run `bun dev` and manually test at http://localhost:3000
4. Run `bun run prettier -- --write` to format code
5. Verify no formatting issues with `bun run prettier -- --check`

### Repository Root Structure

```
.
├── .github/               # GitHub configuration
├── .gitignore            # Git ignore patterns
├── .prettierrc           # Prettier configuration (empty object)
├── README.md             # Basic Bun + React template info
├── bun-env.d.ts          # Bun type definitions
├── bun.lock              # Bun lockfile
├── bunfig.toml          # Bun configuration (serves static files)
├── package.json          # Project dependencies and scripts
├── src/                  # Source code
└── tsconfig.json        # TypeScript configuration
```

### Package.json Scripts

- `dev`: `bun --hot src/index.tsx` (development server with hot reload)
- `build`: Bun build command with minification and sourcemaps
- `start`: `NODE_ENV=production bun src/index.tsx` (production server)
- `prettier`: `bunx prettier .` (code formatting)

### Dependencies

- **Runtime**: React 19, React DOM 19
- **Dev Dependencies**: Bun types, React types, Jest 30, Prettier 3.6.2
- **Build Tool**: Bun (all-in-one JavaScript runtime)

## Troubleshooting

### Common Issues

- **Bun not found**: Run `curl -fsSL https://bun.sh/install | bash && source ~/.bashrc`
- **Formatting errors**: Run `bun run prettier -- --write` to fix automatically
- **Test failures**: Check state machine logic in `src/lib/machine.ts` and test expectations
- **Server not starting**: Ensure port 3000 is available or check console for errors

### Performance Expectations

- Dependency installation: ~15 seconds
- Tests: ~10 milliseconds
- Build: ~50 milliseconds
- Code formatting: ~600 milliseconds
- Server startup: immediate (< 1 second)

All operations are very fast due to Bun's performance optimizations.
