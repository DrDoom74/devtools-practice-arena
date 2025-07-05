import { useState } from "react";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
        <div className="grid md:grid-cols-2 gap-4 md:gap-8">
          {/* DOM Manipulation */}
          <Card className="bg-gradient-card shadow-card">
            <CardHeader>
              <CardTitle className="text-devtools-purple">🎨 Элементы для редактирования</CardTitle>
              <CardDescription>Попробуйте изменить эти элементы через DevTools</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 md:space-y-6">
              <div className="space-y-3 md:space-y-4">
                <h3 
                  id="editable-heading" 
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

                <input 
                  type="date" 
                  className="w-full p-2 rounded-md border border-border bg-input text-foreground text-sm md:text-base"
                  defaultValue="2024-01-15"
                />
              </div>
            </CardContent>
          </Card>

          {/* Hover States */}
          <Card className="bg-gradient-card shadow-card">
            <CardHeader>
              <CardTitle className="text-devtools-green">✨ Псевдосостояния</CardTitle>
              <CardDescription>Протестируйте :hover, :focus, :active состояния</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 md:space-y-6">
              <div className="space-y-3 md:space-y-4">
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                  <Button variant="default" className="hover:shadow-glow text-sm md:text-base">
                    Primary Button
                  </Button>
                  <Button variant="destructive" className="hover:shadow-glow text-sm md:text-base">
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