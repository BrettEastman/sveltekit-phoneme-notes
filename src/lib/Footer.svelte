<script lang="ts">
  const links = [
    {
      label: "Source code",
      href: "https://github.com/BrettEastman/sveltekit-phoneme-notes",
    },
    { label: "Developer portfolio", href: "https://www.bretteastman.dev/" },
  ];

  // Paths from Material Design Icons (mdi), matching the bae_astro footer
  const socials = [
    {
      platform: "instagram",
      href: "https://www.instagram.com/brettaustineastman/",
      path: "M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4zm9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8A1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5a5 5 0 0 1-5 5a5 5 0 0 1-5-5a5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3a3 3 0 0 0 3 3a3 3 0 0 0 3-3a3 3 0 0 0-3-3",
    },
    {
      platform: "linkedin",
      href: "https://www.linkedin.com/in/brett-austin-eastman/",
      path: "M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zm-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93zM6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37z",
    },
    {
      platform: "github",
      href: "https://www.github.com/BrettEastman/",
      path: "M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5c.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34c-.46-1.16-1.11-1.47-1.11-1.47c-.91-.62.07-.6.07-.6c1 .07 1.53 1.03 1.53 1.03c.87 1.52 2.34 1.07 2.91.83c.09-.65.35-1.09.63-1.34c-2.22-.25-4.55-1.11-4.55-4.92c0-1.11.38-2 1.03-2.71c-.1-.25-.45-1.29.1-2.64c0 0 .84-.27 2.75 1.02c.79-.22 1.65-.33 2.5-.33s1.71.11 2.5.33c1.91-1.29 2.75-1.02 2.75-1.02c.55 1.35.2 2.39.1 2.64c.65.71 1.03 1.6 1.03 2.71c0 3.82-2.34 4.66-4.57 4.91c.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2",
    },
  ];

  const currentYear = new Date().getFullYear();
</script>

<footer>
  <nav class="links">
    {#each links as link (link.href)}
      <a href={link.href} target="_blank" rel="noopener noreferrer">
        {link.label}
      </a>
    {/each}
  </nav>

  <div class="socials">
    {#each socials as social (social.platform)}
      <a
        href={social.href}
        aria-label={`Go to ${social.platform} page`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="40"
          height="40"
          aria-hidden="true"
        >
          <path fill="currentColor" d={social.path} />
        </svg>
      </a>
    {/each}
  </div>

  <p class="copyright">© {currentYear} Lost Lanes Publishing</p>
</footer>

<style>
  footer {
    margin-top: 56px;
    padding: var(--space-6) 16px;
    background-color: var(--color-paper-strong);
    border-top: 1px solid var(--color-border-soft);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--space-2);
    font-size: var(--text-sm);
    color: var(--color-muted);
  }

  .links {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: var(--space-5);
  }

  .links a {
    color: inherit;
    text-decoration: none;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    transition: color 0.2s ease;
  }

  .socials {
    display: flex;
    justify-content: center;
    gap: var(--space-2);
  }

  .socials a {
    display: inline-flex;
    padding: var(--space-2) var(--space-4);
    color: inherit;
    border-radius: var(--radius-sm);
    transition: color 0.3s ease;
  }

  .links a:hover,
  .socials a:hover {
    color: var(--color-accent);
  }

  .copyright {
    margin: var(--space-2) 0 0;
  }

  @media (max-width: 768px) {
    footer {
      padding: var(--space-5) 12px;
    }
  }
</style>
