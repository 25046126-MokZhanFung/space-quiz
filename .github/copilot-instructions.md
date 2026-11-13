# Copilot instructions

## Project shape

This is a single-page space quiz implemented entirely in `index.html`. The document contains the markup, theme-aware CSS, question data, and quiz behavior in one file. There is no separate application runtime or build pipeline; open the file directly in a browser to run it.

The script's `questions` array is the source of truth for quiz content; each question's `topic` determines which topic-specific runs include it. The topic chooser offers individual topics and an all-topics run. `renderQuestion()` builds each answer button from the active run, `selectAnswer()` handles scoring and feedback, and `showResults()` summarizes that run. The theme toggle uses the CSS custom properties defined in `:root` and `[data-theme="dark"]`; it also remembers the selected theme in local storage.

## Commands and checks

There is no package manifest or build/lint pipeline. Run the focused topic tests with `node --test tests/quiz-topics.test.cjs`. For a manual smoke test, open `index.html` in a browser and check topic selection, keyboard controls, answer selection, score and progress updates, feedback, results, changing topics after a run, and both themes.

## Repository conventions

- Keep the quiz self-contained in `index.html`; there is no server or build step.
- Add or edit quiz content in the `questions` array. Each answer's position is significant: `correct` is its zero-based index.
- Give each question a topic key matching an entry in the `topics` object so it appears in the intended topic-specific quiz.
- Keep shared visual colors in the light and dark CSS custom-property sets, and use those variables for components that should adapt to both themes.
- Preserve native buttons for actions and answer choices, visible keyboard focus styles, and the existing live/status and progress-bar accessibility attributes when changing interactions.
- Keep decorative effects out of the interaction layer; the background grid and decorative symbols are non-interactive.
