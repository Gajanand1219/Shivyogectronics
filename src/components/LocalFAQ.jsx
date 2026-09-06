const faqs = [
  {
    question: 'Where is Shivyog Electrical & Electronics located?',
    answer:
      'Shivyog Electrical & Electronics is located at Mama Chowk, Main Road, Basmath, Hingoli, Maharashtra.'
  },
  {
    question: 'Is Shivyog Electrical & Electronics an electrical shop in Basmath?',
    answer:
      'Yes. Shivyog Electrical & Electronics is a local electrical and electronics shop in Basmath, Hingoli, Maharashtra, offering electrical products, electronics products, lighting products and electrical accessories.'
  },
  {
    question: 'Is Basmath also called Basmat, Vasmat or Vasmath?',
    answer:
      'Yes. Basmath is commonly searched or written online using variations such as Basmat, Vasmat and Vasmath. Wasamat and Vasamat can also appear as search variations.'
  },
  {
    question: 'Is there an electrical shop near Mama Chowk Basmath?',
    answer:
      'Shivyog Electrical & Electronics is located at Mama Chowk, Main Road, Basmath, Hingoli, Maharashtra.'
  },
  {
    question: 'What electrical products are available at Shivyog Electrical?',
    answer:
      'The electrical product range includes commonly required products such as wires, cables, switches, sockets, plugs, MCBs, fans, LED bulbs, LED lights, decorative lighting and other electrical accessories. Availability can vary.'
  },
  {
    question: 'Does Shivyog Electrical sell LED lights in Basmath?',
    answer:
      'Yes. LED bulbs, LED lights and decorative lighting products are part of the electrical and lighting categories. Customers can contact the shop to confirm current availability.'
  },
  {
    question: 'Does Shivyog Electrical sell fans in Basmath?',
    answer:
      'Fans and related electrical products are included in the shop categories. Customers can contact Shivyog Electrical & Electronics for current availability and product details.'
  },
  {
    question: 'Does Shivyog Electrical sell electronics products?',
    answer:
      'Yes. The electronics range includes products and accessories such as TV remotes, DTH remotes and other useful electronics accessories.'
  },
  {
    question: 'Can I get a TV remote in Basmath?',
    answer:
      'Shivyog Electrical & Electronics has TV remotes in its electronics product range. Contact the shop to check availability for your required remote.'
  },
  {
    question: 'Can I get a DTH remote in Basmath?',
    answer:
      'DTH remotes are included in the electronics range. Customers can contact the shop and confirm whether the required remote is currently available.'
  },
  {
    question: 'Does the shop have water heater elements?',
    answer:
      'Water heater elements are included in the product categories. Availability may vary, so customers should contact the shop before visiting.'
  },
  {
    question: 'Does Shivyog Electrical sell electrical switches and sockets?',
    answer:
      'Yes. Switches and sockets are among the commonly required electrical products available through the shop, subject to current stock.'
  },
  {
    question: 'Can I get MCB products in Basmath?',
    answer:
      'MCBs and related electrical protection products are included in the electrical product range. Contact the shop for current availability and specifications.'
  },
  {
    question: 'Does Shivyog Electrical sell electrical wires and cables?',
    answer:
      'Yes. Electrical wires and cables are included among the commonly required electrical materials offered by the shop, subject to availability.'
  },
  {
    question: 'Does Shivyog Electrical serve customers from Hingoli district?',
    answer:
      'Yes. The shop is located in Basmath, Hingoli district, Maharashtra, and serves customers from Basmath and nearby areas.'
  },
  {
    question: 'Where can I find electrical material in Basmath?',
    answer:
      'Shivyog Electrical & Electronics is located at Mama Chowk, Main Road, Basmath, Hingoli, Maharashtra, and offers a range of electrical materials and accessories.'
  },
  {
    question: 'Where can I find electronics products in Vasmat?',
    answer:
      'Shivyog Electrical & Electronics is located in Basmath, also commonly searched as Vasmat or Vasmath, in Hingoli district, Maharashtra.'
  },
  {
    question: 'Is Shivyog Electrical near Mama Chowk Main Road?',
    answer:
      'Yes. The shop address is Mama Chowk, Main Road, Basmath, Hingoli, Maharashtra.'
  },
  {
    question: 'What lighting products can I find in Basmath?',
    answer:
      'The lighting category includes LED bulbs, LED lights and decorative lighting products. Customers can contact the shop for current stock and product options.'
  },
  {
    question: 'Can I contact Shivyog Electrical before visiting?',
    answer:
      'Yes. Customers can use the contact options on the website to ask about product availability, pricing and other requirements before visiting the shop.'
  },
  {
    question: 'What areas does Shivyog Electrical serve?',
    answer:
      'The shop is based in Basmath, Hingoli district, Maharashtra, and serves customers from Basmath and nearby local areas.'
  },
  {
    question: 'Is Shivyog Electrical an electronics shop near Basmath?',
    answer:
      'Yes. Shivyog Electrical & Electronics operates in Basmath and offers electrical products, electronics products, lighting products and accessories.'
  },
  {
    question: 'Where can I find an electrical and electronics shop in Basmath?',
    answer:
      'Shivyog Electrical & Electronics is located at Mama Chowk, Main Road, Basmath, Hingoli, Maharashtra.'
  },
  {
    question: 'Does Shivyog Electrical provide decorative lights?',
    answer:
      'Yes. Decorative lighting products are included in the lighting category. Contact the shop to confirm current availability.'
  },
  {
    question: 'What can I buy from Shivyog Electrical & Electronics?',
    answer:
      'The website categories include electrical materials, electronics accessories, lighting products, fans, TV and DTH remotes, water heater elements, decorative lights and other electrical accessories.'
  }
]

export default function LocalFAQ() {
  return (
    <section
      id="faq"
      className="py-12 md:py-16 px-4 bg-navy-50"
      aria-labelledby="faq-title"
    >
      <div className="max-w-5xl mx-auto">

        <div className="text-center mb-10">
          <h2
            id="faq-title"
            className="text-2xl md:text-4xl font-bold text-navy-800"
          >
            Frequently Asked Questions
          </h2>

          <p className="mt-4 text-base md:text-lg text-navy-500">
            Shivyog Electrical & Electronics – Basmath, Basmat, Vasmat,
            Vasmath, Hingoli
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <details
              key={index}
              className="group rounded-xl border border-navy-100 bg-white p-5 shadow-sm"
            >
              <summary className="cursor-pointer list-none pr-6 font-semibold text-navy-800">
                {faq.question}
              </summary>

              <p className="mt-4 leading-7 text-navy-600">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>

      </div>
    </section>
  )
}
