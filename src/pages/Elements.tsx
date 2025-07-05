import { useState } from "react";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "lucide-react";

const Elements = () => {
  const [hoverable, setHoverable] = useState(false);
  const [inputValue, setInputValue] = useState("Измени меня в DevTools!");

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
            🔍 Elements - Инспекция DOM
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Изучите структуру HTML, редактируйте DOM в реальном времени, применяйте псевдосостояния и экспериментируйте с CSS
          </p>
        </div>

        {/* Instructions */}
        <Card className="mb-8 bg-gradient-card border-devtools-blue/20">
          <CardHeader>
            <CardTitle className="text-devtools-blue">📋 Инструкции для практики</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h3 className="font-semibold text-devtools-green">🎯 Что попробовать:</h3>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Кликните ПКМ → Inspect Element на любом элементе</li>
                  <li>• Измените текст через Edit as HTML</li>
                  <li>• Примените :hover состояние в Styles</li>
                  <li>• Добавьте новый CSS класс</li>
                  <li>• Измените атрибуты элементов</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-devtools-orange">⚙️ Полезные функции:</h3>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Force State (:hover, :focus, :active)</li>
                  <li>• Edit as HTML / Edit Text</li>
                  <li>• Copy element / Copy selector</li>
                  <li>• Hide element / Delete element</li>
                  <li>• Computed styles просмотр</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Interactive Elements */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
          {/* DOM Manipulation */}
          <Card className="bg-gradient-card shadow-card">
            <CardHeader>
              <CardTitle className="text-devtools-purple">🎨 Элементы для редактирования</CardTitle>
              <CardDescription>Попробуйте изменить эти элементы через DevTools</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 md:space-y-6 px-3 md:px-6">
              <div className="space-y-2 md:space-y-4">
                <h3 
                  className="text-2xl font-bold text-primary hover:text-accent transition-smooth cursor-pointer"
                  data-testid="main-heading"
                >
                  Заголовок для редактирования
                </h3>
                
                <p 
                  className="text-muted-foreground p-3 md:p-4 rounded-lg border border-border bg-muted/50 text-sm md:text-base"
                  contentEditable
                  suppressContentEditableWarning={true}
                >
                  Этот текст можно редактировать прямо здесь или через DevTools. 
                  Попробуйте изменить его содержимое!
                </p>

                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="w-full"
                  placeholder="Поле для ввода"
                  data-element="input-field"
                />

                <Select defaultValue="option1">
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Выберите опцию" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="option1">Опция 1</SelectItem>
                    <SelectItem value="option2">Опция 2</SelectItem>
                    <SelectItem value="option3">Опция 3</SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex items-center gap-2">
                  <input 
                    type="date" 
                    className="flex-1 p-2 rounded-md border border-border bg-input text-foreground text-sm md:text-base"
                    defaultValue="2024-01-15"
                  />
                  {/* Decorative calendar icon for search practice */}
                  <Calendar 
                    id="calendar-icon"
                    data-element="calendar"
                    className="calendar-selector-practice w-6 h-6 text-primary hover:text-accent transition-smooth"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Hover States */}
          <Card className="bg-gradient-card shadow-card">
            <CardHeader>
              <CardTitle className="text-devtools-green">✨ Псевдосостояния</CardTitle>
              <CardDescription>Протестируйте :hover, :focus, :active состояния</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 md:space-y-6 px-3 md:px-6">
              <div className="space-y-2 md:space-y-4">
                <Button
                  className={`w-full transition-smooth ${hoverable ? 'shadow-glow' : ''}`}
                  onMouseEnter={() => setHoverable(true)}
                  onMouseLeave={() => setHoverable(false)}
                  variant="outline"
                >
                  Наведите курсор (или примените :hover в DevTools)
                </Button>

                <div className="group p-3 md:p-4 rounded-lg border border-border bg-muted/30 hover:bg-accent/20 hover:border-accent transition-smooth cursor-pointer">
                  <h4 className="font-semibold group-hover:text-accent transition-smooth text-sm md:text-base">
                    Карточка с hover-эффектом
                  </h4>
                  <p className="text-xs md:text-sm text-muted-foreground group-hover:text-accent-foreground">
                    При наведении меняется фон и цвет текста
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 md:gap-4">
                  <Button variant="default" className="hover:shadow-glow text-sm md:text-base flex-1">
                    Primary Button
                  </Button>
                  <Button variant="destructive" className="hover:shadow-glow text-sm md:text-base flex-1">
                    Danger Button
                  </Button>
                </div>

                <div className="p-3 md:p-4 rounded-lg bg-gradient-primary/10 border border-primary/20">
                  <p className="text-xs md:text-sm">
                    <strong>💡 Совет:</strong> В DevTools → Elements → Styles найдите 
                    элемент и нажмите :hov, чтобы принудительно применить псевдосостояния.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Selector Practice Section */}
        <Card className="mt-8 bg-gradient-card shadow-card">
          <CardHeader>
            <CardTitle className="text-devtools-blue">🎯 Практика поиска элементов</CardTitle>
            <CardDescription>Попробуйте найти эти элементы через Inspect Element или поиск по селектору (Ctrl+F в панели Elements)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-semibold text-devtools-green">🔍 Элементы с уникальными ID:</h4>
                <div className="space-y-3">
                  <div 
                    id="practice-element"
                    className="p-3 bg-primary/10 border border-primary/20 rounded-lg text-sm"
                  >
                    Элемент с ID: #practice-element
                  </div>
                  <button 
                    id="unique-button"
                    className="px-4 py-2 bg-accent/20 hover:bg-accent/30 border border-accent/40 rounded-md text-sm transition-smooth"
                  >
                    Кнопка с ID: #unique-button
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold text-devtools-purple">📝 Элементы с data-атрибутами:</h4>
                <div className="space-y-3">
                  <span 
                    data-qa="test-element"
                    data-testid="automation-target"
                    className="inline-block p-2 bg-muted/50 border border-border rounded text-sm"
                  >
                    Элемент с data-qa="test-element"
                  </span>
                  <div 
                    data-role="navigation-item"
                    data-index="42"
                    className="p-3 bg-secondary/30 border border-secondary/50 rounded-lg text-sm"
                  >
                    Элемент с несколькими data-атрибутами
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-devtools-orange">🎨 Элементы с множественными классами:</h4>
              <p className="text-xs text-muted-foreground mb-3">
                Каждый элемент имеет несколько CSS-классов. Используйте комбинированные селекторы (.class1.class2.class3)
              </p>
              <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-3">
                <div className="highlight important practice text-center p-3 bg-gradient-primary/20 border border-primary/30 rounded-lg text-sm">
                  .highlight.important.practice
                </div>
                <div className="card primary featured text-center p-3 bg-accent/20 border border-accent/30 rounded-lg text-sm">
                  .card.primary.featured
                </div>
                <div className="item list-element active text-center p-3 bg-secondary/20 border border-secondary/30 rounded-lg text-sm">
                  .item.list-element.active
                </div>
                <div className="component ui-element interactive text-center p-3 bg-muted/30 border border-border rounded-lg text-sm">
                  .component.ui-element.interactive
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-devtools-red">🔗 Практика nth-child селекторов:</h4>
              <p className="text-xs text-muted-foreground mb-3">
                Используйте специфичные селекторы: .practice-list li:nth-child(2) или ul.practice-list li:first-child
              </p>
              <ul className="practice-list space-y-2">
                <li className="practice-list-item p-2 bg-muted/30 border-l-4 border-primary text-sm">Первый элемент (.practice-list li:first-child)</li>
                <li className="practice-list-item p-2 bg-muted/30 border-l-4 border-accent text-sm">Второй элемент (.practice-list li:nth-child(2))</li>
                <li className="practice-list-item p-2 bg-muted/30 border-l-4 border-secondary text-sm">Третий элемент (.practice-list li:nth-child(3))</li>
                <li className="practice-list-item p-2 bg-muted/30 border-l-4 border-muted-foreground text-sm">Последний элемент (.practice-list li:last-child)</li>
              </ul>
            </div>

          </CardContent>
        </Card>

        {/* Advanced Features */}
        <Card className="mt-8 bg-gradient-card shadow-card">
          <CardHeader>
            <CardTitle className="text-devtools-orange">🔧 Дополнительные возможности</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <h4 className="font-semibold text-devtools-blue">Копирование селекторов</h4>
                <p className="text-sm text-muted-foreground">
                  ПКМ на элементе → Copy → Copy selector для получения CSS-селектора
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-devtools-green">Скрытие элементов</h4>
                <p className="text-sm text-muted-foreground">
                  Клавиша H в Elements скрывает выбранный элемент (visibility: hidden)
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-devtools-purple">Вычисленные стили</h4>
                <p className="text-sm text-muted-foreground">
                  Вкладка Computed показывает финальные CSS-свойства элемента
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Elements;