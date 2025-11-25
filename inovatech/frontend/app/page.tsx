import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Heart, Sparkles, Shield, Smartphone, MessageCircleHeart, Users, ArrowRight } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-50 w-full border-b border-primary/10 bg-background/80 backdrop-blur-md">
        <div className="container flex h-18 items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
              <Heart className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">Emote Tutor</span>
          </Link>
          <nav className="flex items-center gap-3">
            <Button variant="ghost" className="text-muted-foreground hover:text-foreground" asChild>
              <Link href="/login">Entrar</Link>
            </Button>
            <Button className="rounded-full px-6" asChild>
              <Link href="/login">Começar grátis</Link>
            </Button>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <section className="relative overflow-hidden py-24 md:py-32">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
          <div className="container relative px-6">
            <div className="mx-auto max-w-4xl text-center">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
                <Sparkles className="h-4 w-4" />
                Comunicação acessível e afetuosa
              </div>
              <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground text-balance md:text-5xl lg:text-6xl">
                Dando voz a cada criança através da <span className="text-primary">tecnologia e carinho</span>
              </h1>
              <p className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground text-pretty leading-relaxed md:text-xl">
                O Emote Tutor conecta famílias e promove a expressão de crianças autistas não verbais com uma solução
                intuitiva e cheia de amor.
              </p>
              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button size="lg" className="h-14 rounded-full px-8 text-base" asChild>
                  <Link href="/login">
                    Começar agora
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="h-14 rounded-full px-8 text-base bg-transparent" asChild>
                  <Link href="#como-funciona">Saiba mais</Link>
                </Button>
              </div>
            </div>

            <div className="mx-auto mt-16 max-w-3xl">
              <div className="relative rounded-3xl bg-gradient-to-br from-primary/20 via-accent/10 to-secondary/20 p-3">
                <img
                  src="/dispositivo-comunicacao-crianca-colorido.jpg"
                  alt="Criança usando dispositivo Emote Tutor"
                  className="w-full rounded-2xl object-cover shadow-2xl"
                />
              </div>
            </div>
          </div>
        </section>

        <section id="como-funciona" className="border-t border-primary/10 bg-muted/30 py-24">
          <div className="container px-6">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground text-balance md:text-4xl">
                Como o Emote Tutor funciona?
              </h2>
              <p className="text-lg text-muted-foreground text-pretty leading-relaxed">
                Um sistema pensado com carinho para colocar o poder da comunicação nas mãos das crianças.
              </p>
            </div>

            <div className="mx-auto mt-16 grid max-w-5xl gap-6 md:grid-cols-3">
              <Card className="group relative overflow-hidden border-primary/10 p-8 transition-all hover:border-primary/30 hover:shadow-lg">
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <Smartphone className="h-7 w-7" />
                </div>
                <h3 className="mb-3 text-xl font-semibold text-foreground">Dispositivo Intuitivo</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Botões coloridos e amigáveis que a criança pressiona para expressar necessidades e sentimentos.
                </p>
              </Card>

              <Card className="group relative overflow-hidden border-primary/10 p-8 transition-all hover:border-primary/30 hover:shadow-lg">
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/20 text-accent transition-colors group-hover:bg-accent group-hover:text-accent-foreground">
                  <MessageCircleHeart className="h-7 w-7" />
                </div>
                <h3 className="mb-3 text-xl font-semibold text-foreground">Mensagens Personalizadas</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Pais configuram mensagens únicas para cada botão, adaptando às necessidades da criança.
                </p>
              </Card>

              <Card className="group relative overflow-hidden border-primary/10 p-8 transition-all hover:border-primary/30 hover:shadow-lg">
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary/30 text-secondary-foreground transition-colors group-hover:bg-secondary">
                  <Users className="h-7 w-7" />
                </div>
                <h3 className="mb-3 text-xl font-semibold text-foreground">Conexão em Tempo Real</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Notificações instantâneas quando a criança interage, mantendo a família sempre conectada.
                </p>
              </Card>
            </div>
          </div>
        </section>

        <section className="py-24">
          <div className="container px-6">
            <div className="mx-auto max-w-4xl">
              <Card className="overflow-hidden border-primary/10 bg-gradient-to-br from-primary/5 via-background to-accent/5">
                <div className="flex flex-col items-center gap-8 p-10 text-center md:p-16">
                  <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-primary/10">
                    <Shield className="h-10 w-10 text-primary" />
                  </div>
                  <div>
                    <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground text-balance md:text-4xl">
                      Segurança e Privacidade
                    </h2>
                    <p className="mx-auto max-w-xl text-lg text-muted-foreground text-pretty leading-relaxed">
                      Os dados da sua família estão protegidos com criptografia de ponta a ponta. Nada é compartilhado
                      sem sua permissão.
                    </p>
                  </div>
                  <Button size="lg" className="h-14 rounded-full px-8 text-base" asChild>
                    <Link href="/login">
                      Começar gratuitamente
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-primary/10 py-10">
        <div className="container flex flex-col items-center justify-between gap-6 px-6 md:flex-row">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Heart className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-semibold text-foreground">Emote Tutor</span>
          </div>
          <p className="text-sm text-muted-foreground">Feito com carinho para famílias especiais.</p>
          <nav className="flex gap-6 text-sm text-muted-foreground">
            <Link href="#" className="transition-colors hover:text-foreground">
              Privacidade
            </Link>
            <Link href="#" className="transition-colors hover:text-foreground">
              Termos
            </Link>
            <Link href="#" className="transition-colors hover:text-foreground">
              Suporte
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  )
}
