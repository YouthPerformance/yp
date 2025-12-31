import { useState } from 'react'

const faqItems = [
  {
    q: 'Who is this for?',
    a: 'Youth athletes and families who want a smarter, safer way to train fundamentals and performance.'
  },
  {
    q: 'Do we need a full gym?',
    a: 'No. Most work is bodyweight, bands, and isometrics. You can train at home or on a court.'
  },
  {
    q: 'Is this safe for kids?',
    a: 'Yes—sessions are designed with progressions and clear coaching. Start where you are and build step by step.'
  },
  {
    q: 'How much time does it take?',
    a: 'Most sessions are short. Consistency matters more than long workouts.'
  },
  {
    q: 'Do you have a mobile app?',
    a: 'Yes. You can train on your phone and keep everything in one place.'
  },
  {
    q: 'Can parents follow along too?',
    a: 'Absolutely. Parents can learn the basics, support the process, and track progress.'
  },
  {
    q: 'Is this medical advice?',
    a: 'No. This is training and education. If your athlete has pain or an injury, check with a qualified professional.'
  }
]

function FAQ() {
  const [openIndex, setOpenIndex] = useState(null)

  const toggleQuestion = (index) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <div className="min-h-screen bg-black py-12">
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-3xl md:text-4xl font-yp-display uppercase tracking-wide text-white text-center mb-4">
          Frequently Asked Questions
        </h1>
        <p className="text-dark-text-secondary text-center mb-12">
          Everything you need to know about YouthPerformance
        </p>

        <div className="space-y-3">
          {faqItems.map((item, index) => (
            <div
              key={index}
              className="bg-black-50 border border-black-400 rounded-xl overflow-hidden"
            >
              <button
                onClick={() => toggleQuestion(index)}
                className="w-full p-5 text-left flex items-center justify-between hover:bg-black-100 transition-colors"
              >
                <span className="font-medium text-white pr-4">{item.q}</span>
                <svg
                  className={`w-5 h-5 text-cyan-500 flex-shrink-0 transition-transform ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openIndex === index && (
                <div className="px-5 pb-5 text-dark-text-secondary">
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="text-center mt-12 p-8 bg-black-50 border border-black-400 rounded-xl">
          <p className="text-dark-text-secondary mb-4">
            Still have questions?
          </p>
          <button className="bg-cyan-500 hover:bg-cyan-600 text-black font-semibold px-6 py-3 rounded-lg transition-colors">
            Contact Support
          </button>
        </div>
      </div>
    </div>
  )
}

export default FAQ
