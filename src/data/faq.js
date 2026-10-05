/** JSON-LD FAQPage a partir de los mismos ítems que muestra FaqList. */
export const faqJsonLd = (items) => ({
  '@type': 'FAQPage',
  mainEntity: items.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: { '@type': 'Answer', text: item.answer },
  })),
});
