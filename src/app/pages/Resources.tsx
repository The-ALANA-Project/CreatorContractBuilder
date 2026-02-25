import { Card, CardContent } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { ExternalLink, ArrowLeft, BookOpen, FileText, Users, Shield, Zap, Home } from "lucide-react";
import { Link, useNavigate } from "react-router";

export default function Resources() {
  const navigate = useNavigate();

  const resources = [
    {
      category: "Help",
      icon: Shield,
      items: [
        {
          title: "HateAid",
          description: "HateAid is a Berlin-based non-profit organization that supports victims of digital violence, such as hate speech, stalking, and defamation. They provide free emotional counseling and legal aid, including financing lawsuits against perpetrators and platforms. HateAid offers resources for documenting hate speech, takes on landmark cases against social media platforms, and advocates for better protection for victims.",
          url: "https://hateaid.org/en/",
          author: "",
          authorUrl: "",
        },
      ],
    },
    {
      category: "Platforms",
      icon: Zap,
      items: [
        {
          title: "Meet With",
          description: "A scheduling platform that helps creators monetize their time through paid 1-on-1 calls, consultations, and meetings. Offer your expertise directly to your audience, set your own rates, and manage bookings seamlessly.",
          url: "https://meetwith.xyz/",
          author: "",
          authorUrl: "",
        },
        {
          title: "Paragraph",
          description: "A newsletter and publishing platform for creators to build and monetize their audience. Write, publish, and grow your subscriber base with built-in monetization tools including subscriptions and web3 features.",
          url: "https://paragraph.com/",
          author: "",
          authorUrl: "",
        },
      ],
    },
    {
      category: "Tools",
      icon: FileText,
      items: [
        {
          title: "Freelance Rate Guide",
          description: "Auto-generate polite forms of saying no to unpaid jobs. Often freelancers struggle to say no because they fear missing out on opportunities and lack more refined wording. Shivani's Freelance Rate Guide helps you to find the right wording in seconds to reply confidently to DM's, Emails and more.",
          url: "https://www.freelancerateguide.com/",
          author: "Shivani Shah",
          authorUrl: "https://www.linkedin.com/in/wordsbyshivani/",
        },
        {
          title: "Creator Branding Studio",
          description: "An interactive personal branding journey studio that transforms your goals and aesthetics into a tailored personal brand concept in less than 30 minutes. Build your brand visually on a freeform canvas through a 10-step guided journey, then export a complete brief for a brand designer you hire or yourself to continue the work.",
          url: "https://creator-branding.com/",
          author: "Stella Achenbach",
          authorUrl: "https://www.linkedin.com/in/stella-achenbach/",
        },
      ],
    },
    // More categories can be added here in the future
    // {
    //   category: "Books",
    //   icon: BookOpen,
    //   items: []
    // },
    // {
    //   category: "Communities",
    //   icon: Users,
    //   items: []
    // },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Toolbar */}
      <div className="fixed top-40 left-6 z-20 flex flex-col gap-3" data-zoom-control="true">
        {/* Home/Contract Builder Button */}
        <button
          className="w-12 h-12 flex items-center justify-center bg-[#131718] text-[#FEE6EA] rounded-full shadow-[0_6px_6px_rgba(0,0,0,0.2),0_0_20px_rgba(0,0,0,0.1)] transition-all duration-[400ms] ease-[cubic-bezier(0.175,0.885,0.32,2.2)] hover:scale-105 hover:shadow-[0_8px_8px_rgba(0,0,0,0.25),0_0_24px_rgba(0,0,0,0.15)]"
          onClick={() => navigate('/')}
          title="Contract Builder"
        >
          <Home className="w-5 h-5" />
        </button>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-primary border-b border-primary/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.1)] py-6 sm:py-6">
        <div className="pl-4 pr-4 sm:pl-6 sm:pr-6">
          <div className="flex items-center justify-between">
            {/* Left Side: Title & Tagline */}
            <div className="flex flex-col">
              <h1 className="text-2xl sm:text-2xl md:text-3xl font-semibold text-primary-foreground">
                Resources for Creators
              </h1>
              <p className="text-sm sm:text-sm text-[#fee6ea] mt-1">
                Curated tools, guides, and resources to help you advance your creative career beyond just pricing.
              </p>
            </div>

            {/* Right Side: Action Icons */}
            <div className="flex items-center gap-2 sm:gap-3">
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 md:py-12 mt-3 sm:mt-0">
        <div className="max-w-4xl mx-auto space-y-8">
          {resources.map((section) => {
            const IconComponent = section.icon;
            return (
              <div key={section.category}>
                <div className="flex items-center gap-3 mb-6">
                  <IconComponent className="h-6 w-6 text-primary" />
                  <h2 className="font-semibold text-[25px]">{section.category}</h2>
                </div>

                <div className="grid gap-6">
                  {section.items.map((item) => (
                    <Card 
                      key={item.title}
                      className="backdrop-blur-2xl bg-card/80 border-border shadow-[0_8px_32px_0_rgba(0,0,0,0.1)] hover:shadow-[0_12px_48px_0_rgba(0,0,0,0.15)] transition-all duration-300"
                    >
                      <CardContent className="p-6 sm:p-8">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                          <div className="flex-1">
                            <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                            <p className="text-sm sm:text-base text-muted-foreground mb-4">
                              {item.description}
                            </p>
                            {item.author && (
                              <p className="text-sm text-muted-foreground">
                                Created by{" "}
                                <a 
                                  href={item.authorUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-primary hover:underline font-medium"
                                >
                                  {item.author}
                                </a>
                              </p>
                            )}
                          </div>
                          <div className="flex-shrink-0">
                            <a 
                              href={item.url}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Button className="w-full sm:w-auto">
                                {section.category === "Help" ? "Learn More" : section.category === "Platforms" ? "Visit Platform" : "Visit Tool"}
                                
                              </Button>
                            </a>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            );
          })}

          {/* Coming Soon Section */}
          
        </div>
      </main>

      {/* Divider */}
      <div className="border-t border-[#131718]" />

      {/* Footer */}
      <footer className="mt-3 sm:mt-4 text-center text-xs sm:text-sm text-muted-foreground px-[16px] pt-[0px] pb-[16px]">
        <p>
          Share this calculator, use it, and consider{' '}
          <a 
            href="https://ko-fi.com/stellaachenbach" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-primary hover:underline font-bold"
          >
            donating
          </a>
          {' '}if you found it helpful.
        </p>
        <p className="mt-2">
          Made with 💜 by{' '}
          <a 
            href="https://www.linkedin.com/in/stella-achenbach/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            @stellaachenbach
          </a>
        </p>
      </footer>
    </div>
  );
}