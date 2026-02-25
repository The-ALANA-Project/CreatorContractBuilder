# Creator Contract Builder

![Creator Contract Builder](https://pink-quick-lizard-297.mypinata.cloud/ipfs/bafybeihvywcfkslwnr3pgx3lod3hbzaaaomapy2gerbommzdby2d3y6v4e/CCB-Social%20Crawler%20Image.png)

A free professional contract builder for creators and creative freelancers. Generate custom, export-ready contracts with toggleable legal clauses, multiple contract types, multi-currency support (including stablecoins), and comprehensive legal protections -- all from a single mobile-optimized page.

## Features

### Contract Builder
- **3 Contract Types**: Digital Creator Services, Physical Product Creation, Content Creation -- each with tailored template presets that auto-populate section content
- **11 Toggleable Sections**: Scope of Work, Deliverables, Timeline, Payment Terms, Rights & Usage, Revision Policy, Cancellation Policy, Confidentiality (with 8 sub-clauses), Governing Law & Jurisdiction, Liability & Warranties, Dispute Resolution
- **General Provisions Boilerplate**: Entire Agreement, Severability, Amendments & Modifications, Waiver, Assignment, and Notice Provisions -- automatically included in all exports
- **Custom Clauses**: Add unlimited custom clauses with title and content
- **Payment Details**: Conditional fields for Bank Transfer, PayPal, Venmo, Zelle, Crypto, and custom payment methods
- **Currency Support**: 10 fiat currencies (USD, EUR, GBP, CAD, AUD, JPY, CNY, INR, BRL, MXN) and 6 stablecoins (USDT, USDC, DAI, BUSD, EURC, USDGLO)
- **Inline Education**: Contextual explanations for each contract section to help creators understand legal terms
- **Live Preview**: WYSIWYG preview tab that faithfully mirrors export output
- **Export Formats**: PDF, Markdown, and JSON -- all fully aligned with the preview
- **JSON Import**: Upload a previously exported JSON to restore a contract
- **Collapsible Section Cards**: Headers with checkmark badges indicating enabled status when collapsed
- **Mobile-First**: Fully optimized for mobile with a sticky bottom navigation bar

### Resources Page
- Curated tools, platforms, and help resources for creators
- Community-contributed resources to support your creative business

### Design
- Liquid glass aesthetic with glassmorphism and backdrop blur effects
- Brand colors: #FEE6EA (light rose) and #131718 (off-black)
- Work Sans typography
- 1px outlines, 8px rounded corners, consistent hover effects
- Fully mobile-optimized and responsive

## SEO & Discoverability

The app includes comprehensive SEO optimizations:
- **Meta tags**: Title, description, keywords, author, robots
- **Open Graph tags**: For Facebook, LinkedIn, Discord, Telegram, WhatsApp sharing
- **Twitter Card tags**: For optimal Twitter/X previews
- **Structured data**: JSON-LD WebApplication schema with featureList
- **Sitemap**: `/sitemap.xml` for search engine crawlers
- **Robots.txt**: Allows all search engines to index the site
- **Semantic HTML**: Proper use of header, main, nav, footer tags
- **Canonical URL**: Prevents duplicate content issues
- **Google Analytics**: Integrated tracking (G-LZYD64P37P) with cookie consent

## Tech Stack

- React 18 with TypeScript
- Vite build tool
- Tailwind CSS v4
- React Router (Data mode) for navigation
- Radix UI components (Button, Card, Input, Label, Textarea, Checkbox, Tooltip)
- jsPDF for PDF export
- Lucide React for icons

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Deployment

This app is configured for Netlify deployment. Favicon and OG images are served directly from IPFS via Pinata -- no manual asset uploads needed.

1. Push changes to your GitHub repository
2. Netlify will automatically build and deploy
3. Build command: `npm run build`
4. Publish directory: `dist`

## Project Structure

```
/src
  /app
    /components
      /ui           # Radix UI component wrappers
      /figma        # Figma-specific components
      CookieBanner.tsx
      ScrollToTop.tsx
    /pages
      ContractBuilder.tsx  # Homepage - Contract builder
      Resources.tsx        # Curated creator resources
      RootLayout.tsx       # Root layout with scroll restoration
    routes.ts              # React Router configuration
    App.tsx                # Root component with RouterProvider
  /styles
    theme.css       # Tailwind theme tokens
    fonts.css       # Font imports
    index.css       # Global styles
    tailwind.css    # Tailwind imports
  main.tsx
/public
  sitemap.xml
  robots.txt
```

## Cookie Compliance

The app uses Google Analytics and includes a cookie consent banner that:
- Appears on first visit with a 1-second delay
- Persists user choice in localStorage
- Links to Google's privacy policy
- Fully styled to match the app's glassmorphism aesthetic
- Decline button with transparent background and light rose border (hover fills light rose with off-black text)
- Complies with GDPR/privacy regulations

## License

MIT License

Copyright (c) 2026 Stella Achenbach

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

### What This Means

This project is **open source** under the MIT License, which means:
- You can use it freely -- run, study, modify, and distribute this tool
- You can modify it -- adapt the code for your own needs or projects
- You can use it commercially -- integrate it into your own products or services
- Attribution appreciated -- keep the copyright notice and give credit to the original author

The only requirement is to include the original copyright and license notice in any copies or substantial portions of the software. No warranty is provided -- use at your own risk!

## Contributing

Found a bug or have a suggestion? Feel free to open an issue or submit a pull request.

## Support

If you found this tool helpful, consider:
- Sharing it with other creators
- [Donating on Ko-fi](https://ko-fi.com/stellaachenbach)
- Contributing resources to the Resources page

---

Made with care by [Stella Achenbach](https://www.linkedin.com/in/stella-achenbach/)