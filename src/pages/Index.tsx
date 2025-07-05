import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Index = () => {
  const features = [
    {
      title: "🔍 Elements",
      description: "Инспекция DOM, редактирование HTML/CSS, псевдосостояния",
      link: "/elements",
      color: "devtools-blue"
    },
    {
      title: "💬 Console", 
      description: "Выполнение JavaScript, отладка, работа с объектами",
      link: "/console",
      color: "devtools-purple"
    },
    {
      title: "🌐 Network",
      description: "Анализ HTTP запросов, производительность, API тестирование", 
      link: "/network",
      color: "devtools-green"
    },
    {
      title: "📦 Application",
      description: "localStorage, sessionStorage, cookies, IndexedDB",
      link: "/application", 
      color: "devtools-orange"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="mb-8">
            <div className="w-16 h-16 md:w-24 md:h-24 bg-gradient-primary rounded-2xl mx-auto mb-4 md:mb-6 flex items-center justify-center shadow-glow">
              <span className="text-2xl md:text-4xl">🛠</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold mb-4 md:mb-6 bg-gradient-primary bg-clip-text text-transparent px-4">
              Chrome DevTools Тренажер
            </h1>
            <p className="text-base md:text-xl text-muted-foreground max-w-3xl mx-auto mb-6 md:mb-8 px-4">
              Интерактивная практика по самым важным вкладкам Chrome DevTools для QA инженеров. 
              Изучайте, тестируйте и совершенствуйте навыки отладки веб-приложений.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto mb-12">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">4</div>
              <div className="text-sm text-muted-foreground">Основные вкладки</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-accent">20+</div>
              <div className="text-sm text-muted-foreground">Интерактивных функций</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-devtools-green">100%</div>
              <div className="text-sm text-muted-foreground">Практическое обучение</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-devtools-orange">0₽</div>
              <div className="text-sm text-muted-foreground">Бесплатно</div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {features.map((feature, index) => (
            <Card key={index} className="bg-gradient-card shadow-card hover:shadow-glow transition-smooth group">
              <CardHeader>
                <CardTitle className={`text-2xl text-${feature.color} group-hover:scale-105 transition-smooth`}>
                  {feature.title}
                </CardTitle>
                <CardDescription className="text-lg">
                  {feature.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full group-hover:shadow-glow">
                  <Link to={feature.link}>
                    Начать практику
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* About Section */}
        <Card className="bg-gradient-card shadow-card mb-16">
          <CardHeader>
            <CardTitle className="text-3xl text-center bg-gradient-accent bg-clip-text text-transparent">
              Почему DevTools важны для QA?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h4 className="text-xl font-semibold text-devtools-blue">🐛 Отладка и диагностика</h4>
                <p className="text-muted-foreground">
                  DevTools помогают находить корень проблем: JavaScript ошибки, медленные запросы, 
                  некорректные стили. Вместо поверхностного описания "не работает" вы можете 
                  предоставить точную техническую информацию.
                </p>
              </div>
              <div className="space-y-4">
                <h4 className="text-xl font-semibold text-devtools-green">⚡ Тестирование производительности</h4>
                <p className="text-muted-foreground">
                  Анализируйте скорость загрузки, размеры файлов, время ответа API. 
                  Симулируйте медленное соединение и мобильные устройства для комплексного 
                  тестирования пользовательского опыта.
                </p>
              </div>
              <div className="space-y-4">
                <h4 className="text-xl font-semibold text-devtools-purple">🔍 Глубокий анализ</h4>
                <p className="text-muted-foreground">
                  Изучайте структуру DOM, изменяйте стили в реальном времени, 
                  анализируйте сетевые запросы. DevTools превращают браузер в мощную 
                  среду разработки и тестирования.
                </p>
              </div>
              <div className="space-y-4">
                <h4 className="text-xl font-semibold text-devtools-orange">🎯 Автоматизация тестов</h4>
                <p className="text-muted-foreground">
                  Копируйте селекторы для Selenium, изучайте API endpoints для автотестов, 
                  анализируйте поведение JavaScript. DevTools - фундамент для создания 
                  надёжных автоматизированных тестов.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <div className="text-center mb-16">
          <div className="max-w-2xl mx-auto px-4">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">Готовы начать?</h3>
            <p className="text-muted-foreground mb-8">
              Выберите любую вкладку DevTools и начните интерактивное обучение. 
              Каждый раздел содержит практические упражнения и детальные объяснения.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              {features.map((feature, index) => (
                <Button key={index} asChild variant="outline" className="hover:shadow-glow text-sm">
                  <Link to={feature.link}>
                    {feature.title}
                  </Link>
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center border-t border-border pt-8">
          <p className="text-muted-foreground text-sm">
            Школа Алексея Клименко по тестированию ПО | {" "}
            <a 
              href="https://t.me/QA_AKlimenko" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:text-accent transition-colors"
            >
              Телеграм канал
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
