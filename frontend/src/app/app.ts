import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  imports: [RouterLink, RouterOutlet],
  selector: 'app-root',
  template: `
    <div class="app-shell">
      <header class="app-header">
        <div>
          <p class="eyebrow">CFP Platform</p>
          <h1>Call for Papers</h1>
        </div>
        <a routerLink="/cfp">Submit a talk</a>
      </header>

      <main class="app-main">
        <router-outlet />
      </main>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        min-height: 100vh;
        background:
          radial-gradient(circle at top left, rgba(255, 185, 120, 0.28), transparent 30%),
          linear-gradient(180deg, #fff9f1 0%, #f7efe6 100%);
        color: #2c1d14;
        font-family: 'Segoe UI', sans-serif;
      }

      .app-shell {
        max-width: 960px;
        margin: 0 auto;
        padding: 2rem 1.5rem 3rem;
      }

      .app-header {
        display: flex;
        justify-content: space-between;
        gap: 1rem;
        align-items: end;
        margin-bottom: 2rem;
      }

      .app-header a {
        color: #7a3419;
        font-weight: 700;
      }

      .eyebrow {
        margin: 0 0 0.35rem;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        font-size: 0.75rem;
        color: #a16207;
      }

      h1 {
        margin: 0;
        font-size: clamp(2rem, 4vw, 3.2rem);
        line-height: 1;
      }
    `,
  ],
})
export class App {
  protected title = 'frontend';
}
