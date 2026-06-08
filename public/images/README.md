# Image drop-in guide

Every image area on the site uses the `MediaFrame` component
(`components/ui/MediaFrame.tsx`). While an area has no image it shows a
designed, on-brand placeholder (themed motif + crop-frame). To use a real
image, drop the file in this folder and pass its path as the `src` prop.

Example — add a portrait:

```tsx
// components/AboutSection.tsx
<MediaFrame
  src="/images/portrait.jpg"   // ← add this line
  variant="portrait"
  ratio="4 / 5"
  alt="Soroush Jaberi"
/>
```

## Recommended images

| File (suggested)            | Where it appears              | Type                                   | Ratio  | Min size   |
|-----------------------------|-------------------------------|----------------------------------------|--------|------------|
| `portrait.jpg`              | About — left column           | Real photo, clean studio-style headshot| 4:5    | 800×1000   |
| `research-nlp.jpg`          | Research Focus — NLP card     | Attention map / token-embedding visual | 16:9   | 1280×720   |
| `research-medical.jpg`      | Research Focus — Medical AI   | CT slice with segmentation mask overlay| 16:9   | 1280×720   |
| `research-rag.jpg`          | Research Focus — RAG          | Document→retrieval→answer flow diagram  | 16:9   | 1280×720   |
| `research-vision.jpg`       | Research Focus — Vision       | Pose-keypoint / feature-detection frame | 16:9   | 1280×720   |
| `project-01-sentiment.jpg`  | Projects — case study 01      | Confusion matrix / training curves     | 4:3    | 1200×900   |
| `project-02-rag.jpg`        | Projects — case study 02      | Retrieval → grounded answer screenshot | 4:3    | 1200×900   |
| `project-03-segmentation.jpg`| Projects — case study 03     | CT slice + predicted tumor mask        | 4:3    | 1200×900   |
| `project-04-vision.jpg`     | Projects — case study 04      | Pose keypoints over a webcam frame     | 4:3    | 1200×900   |
| `og-image.png`              | Social share preview (manual) | 1200×630 branded card                  | 1.91:1 | 1200×630   |

## Styling notes

- Images are rendered `object-cover` and keep the scientific crop-frame
  chrome on top, so anything you drop in stays visually consistent.
- Prefer dark / muted backgrounds so images blend with the dark UI.
- Keep files optimized (use WebP/AVIF or compress JPEGs) — `next.config.mjs`
  uses unoptimized images for static export, so size matters for load time.
