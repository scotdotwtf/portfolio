// ty https://www.humankode.com/eleventy/how-to-set-up-tailwind-4-with-eleventy-3/ <3
import { eleventyImageTransformPlugin } from '@11ty/eleventy-img';

import fs from 'fs';
import path from 'path';

import cssnano from 'cssnano';
import postcss from 'postcss';
import tailwindcss from '@tailwindcss/postcss';

const root = 'source';
const out = 'public';

export default function (eleventyConfig) {
  eleventyConfig.on('eleventy.before', async () => {
    const tailwindInputPath = path.resolve(`./${root}/style.css`);
    const tailwindOutputPath = `./${out}/style.css`;
    const cssContent = fs.readFileSync(tailwindInputPath, 'utf8');

    const outputDir = path.dirname(tailwindOutputPath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const result = await processor.process(cssContent, {
      from: tailwindInputPath,
      to: tailwindOutputPath,
    });

    fs.writeFileSync(tailwindOutputPath, result.css);
  });

  const processor = postcss([
    //compile tailwind
    tailwindcss(),

    //minify tailwind css
    cssnano({
      preset: 'default',
    }),
  ]);

  eleventyConfig.addPassthroughCopy(`./${root}/assets`)
  eleventyConfig.addPassthroughCopy(`./${root}/interface.js`)

  eleventyConfig.addPlugin(eleventyImageTransformPlugin, {
    formats: ["avif", "webp", "gif", "auto"],

    formatFiltering: ["transparent", "animated"],

    sharpOptions: {
      animated: true,
    },
  });

  return {
    dir: {
      input: root,
      output: out,
      includes: 'includes'
    }
  };
}