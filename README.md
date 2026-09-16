# Portefólio

Site estático (HTML/CSS/JS puro, sem build) pronto para o GitHub Pages.

## Personalizar

- `projects/*.html` — case studies dos projetos de trabalho (stack, arquitetura, segurança, métricas).
- `index.html` — texto, nome, projetos, links (procura por "O Teu Nome", "oteu@email.com" e os `href="#"` dos projetos/redes sociais).
- `css/style.css` — cores no bloco `:root` no topo do ficheiro (tema claro) e no bloco `@media (prefers-color-scheme: dark)` / `[data-theme="dark"]` (tema escuro).
- `js/script.js` — lógica do botão de tema, não precisa de alterações.

## Publicar no GitHub Pages (grátis)

1. Cria um repositório novo no GitHub (ex: `portfolio-website`).
2. No terminal, dentro desta pasta:
   ```
   git add .
   git commit -m "Portefólio inicial"
   git remote add origin https://github.com/<o-teu-utilizador>/portfolio-website.git
   git push -u origin main
   ```
3. No GitHub, vai a **Settings → Pages**.
4. Em "Source", escolhe **Deploy from a branch**, branch `main`, pasta `/ (root)`, e grava.
5. Ao fim de 1-2 minutos o site fica disponível em:
   `https://<o-teu-utilizador>.github.io/portfolio-website/`

Sempre que fizeres `git push`, o site atualiza-se automaticamente.
