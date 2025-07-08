import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const Console = () => {
  const [output, setOutput] = useState<string[]>([]);
  const [selectedElement, setSelectedElement] = useState<string>("");
  
  // Async testing states
  const [notificationMessage, setNotificationMessage] = useState("");
  const [currentTime, setCurrentTime] = useState("");
  const [timerActive, setTimerActive] = useState(false);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);

  // Async testing functions
  const showNotificationAfterDelay = () => {
    setNotificationMessage(""); // Reset message
    console.log("⏰ Запущен таймер на 2 секунды");
    
    setTimeout(() => {
      setNotificationMessage("Уведомление появилось!");
      console.log("✅ Уведомление показано через 2 секунды");
    }, 2000);
  };

  const startTimer = () => {
    if (timerActive) return;
    
    setTimerActive(true);
    setCurrentTime(new Date().toLocaleTimeString());
    console.log("⏰ Таймер запущен");
    
    const id = setInterval(() => {
      const newTime = new Date().toLocaleTimeString();
      setCurrentTime(newTime);
      console.log("🕐 Время обновлено:", newTime);
    }, 1000);
    
    setIntervalId(id);
  };

  const stopTimer = () => {
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
      setTimerActive(false);
      console.log("⏹️ Таймер остановлен");
      setCurrentTime("Таймер остановлен.");
    }
  };

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [intervalId]);

  const generateError = () => {
    try {
      // Специально создаем ошибку для демонстрации
      throw new Error("Демонстрационная ошибка для DevTools Console");
    } catch (error) {
      console.error("🚨 Ошибка для тестирования:", error);
      setOutput(prev => [...prev, "🚨 Ошибка отправлена в DevTools Console"]);
    }
  };

  const selectElement = (selector: string) => {
    try {
      const element = document.querySelector(selector);
      if (element) {
        setSelectedElement(selector);
        console.log("Selected element:", element);
        setOutput(prev => [...prev, `Элемент выбран: ${selector}`, `Проверьте DevTools Console`]);
      }
    } catch (error) {
      setOutput(prev => [...prev, `Ошибка выбора: ${error.message}`]);
    }
  };

  const clearOutput = () => {
    setOutput([]);
    console.clear();
  };

  const monitorElement = () => {
    const element = document.querySelector('#console-demo-element');
    if (element) {
      // Добавляем мониторинг событий
      ['click', 'mouseover', 'mouseout'].forEach(eventType => {
        element.addEventListener(eventType, (e) => {
          console.log(`Event monitored: ${eventType} on`, e.target);
        });
      });
      setOutput(prev => [...prev, "События мониторятся. Проверьте DevTools Console"]);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
            💬 Console - Выполнение JavaScript
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Выполняйте JavaScript код, работайте с DOM, изучайте и отлаживайте объекты
          </p>
        </div>

        {/* Instructions */}
        <Card className="mb-8 bg-gradient-card border-devtools-blue/20">
          <CardHeader>
            <CardTitle className="text-devtools-blue">📋 Популярные команды Console</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="bg-muted/50 p-3 rounded-lg font-mono text-sm">
                  <div className="text-devtools-green">document.querySelector('.class')</div>
                  <div className="text-muted-foreground">Выбор элемента по селектору</div>
                </div>
                <div className="bg-muted/50 p-3 rounded-lg font-mono text-sm">
                  <div className="text-devtools-green">$0, $1, $2</div>
                  <div className="text-muted-foreground">Последние выбранные элементы</div>
                </div>
                <div className="bg-muted/50 p-3 rounded-lg font-mono text-sm">
                  <div className="text-devtools-green">console.log(), console.error()</div>
                  <div className="text-muted-foreground">Вывод информации в консоль</div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="bg-muted/50 p-3 rounded-lg font-mono text-sm">
                  <div className="text-devtools-orange">monitorEvents($0, 'click')</div>
                  <div className="text-muted-foreground">Мониторинг событий элемента</div>
                </div>
                <div className="bg-muted/50 p-3 rounded-lg font-mono text-sm">
                  <div className="text-devtools-orange">copy()</div>
                  <div className="text-muted-foreground">Копирование объекта в буфер</div>
                </div>
                <div className="bg-muted/50 p-3 rounded-lg font-mono text-sm">
                  <div className="text-devtools-orange">clear()</div>
                  <div className="text-muted-foreground">Очистка консоли</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Async Testing */}
          <Card className="bg-gradient-card shadow-card">
            <CardHeader>
              <CardTitle className="text-devtools-purple">⏱️ Тестирование асинхронного кода</CardTitle>
              <CardDescription>Практика работы с setTimeout, setInterval и отладки</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Notification Test */}
              <div className="space-y-3">
                <h4 className="font-semibold text-devtools-blue">🔔 Уведомление с задержкой</h4>
                <Button 
                  onClick={showNotificationAfterDelay}
                  variant="outline" 
                  className="w-full"
                >
                  Показать уведомление (через 2 секунды)
                </Button>
                
                {notificationMessage && (
                  <div className="bg-devtools-green/10 border border-devtools-green/30 rounded-lg p-3 text-center">
                    <span className="text-devtools-green font-semibold">{notificationMessage}</span>
                  </div>
                )}
                
                <div className="bg-muted/50 p-3 rounded-lg text-xs">
                  <div className="text-devtools-blue font-semibold mb-1">QA-чеклист:</div>
                  <ul className="text-muted-foreground space-y-1">
                    <li>• Сообщение появляется строго через 2 секунды</li>
                    <li>• При повторном клике текст сбрасывается и появляется заново</li>
                    <li>• В DevTools → Console нет ошибок</li>
                    <li>• Можно поставить breakpoint на строчке setTimeout</li>
                  </ul>
                </div>
              </div>

              {/* Timer Test */}
              <div className="space-y-3">
                <h4 className="font-semibold text-devtools-orange">🕐 Интервал с обновлением времени</h4>
                
                <div className="flex gap-2">
                  <Button 
                    onClick={startTimer}
                    disabled={timerActive}
                    variant="outline" 
                    className="flex-1"
                  >
                    Запустить таймер
                  </Button>
                  <Button 
                    onClick={stopTimer}
                    disabled={!timerActive}
                    variant="outline" 
                    className="flex-1"
                  >
                    Остановить
                  </Button>
                </div>

                <div className="bg-muted/30 rounded-lg p-4 text-center font-mono">
                  <div className="text-sm text-muted-foreground mb-1">Текущее время:</div>
                  <div className="text-lg font-semibold text-devtools-green">
                    {currentTime || "Таймер не запущен"}
                  </div>
                  <div className="text-xs text-muted-foreground mt-2">
                    Статус: {timerActive ? "🟢 Активен" : "🔴 Остановлен"}
                  </div>
                </div>
                
                <div className="bg-muted/50 p-3 rounded-lg text-xs">
                  <div className="text-devtools-orange font-semibold mb-1">QA-чеклист:</div>
                  <ul className="text-muted-foreground space-y-1">
                    <li>• Время обновляется раз в секунду</li>
                    <li>• После нажатия "Остановить" оно перестаёт обновляться</li>
                    <li>• Проверить в DevTools → Network, что ничего не загружается</li>
                    <li>• Проверить в Console, что нет setInterval без clearInterval</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Interactive Elements */}
          <Card className="bg-gradient-card shadow-card">
            <CardHeader>
              <CardTitle className="text-devtools-green">🎯 Элементы для тестирования</CardTitle>
              <CardDescription>Используйте эти элементы в своих Console командах</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Demo Element */}
              <div 
                id="console-demo-element"
                className="console-card p-4 rounded-lg bg-gradient-accent/20 border border-accent/30 cursor-pointer transition-smooth hover:shadow-glow"
                onClick={() => console.log('Demo element clicked!')}
              >
                <h4 className="font-semibold text-accent">Демонстрационный элемент</h4>
                <p className="text-sm text-muted-foreground">
                  ID: console-demo-element<br/>
                  Class: console-card
                </p>
              </div>

              {/* Quick Actions */}
              <div className="space-y-3">
                <h5 className="font-semibold">Быстрые действия:</h5>
                
                <Button 
                  onClick={() => selectElement('#console-demo-element')}
                  variant="outline" 
                  className="w-full"
                >
                  Выбрать элемент по ID
                </Button>
                
                <Button 
                  onClick={generateError}
                  variant="outline" 
                  className="w-full text-devtools-red border-devtools-red/30 hover:bg-devtools-red/10"
                >
                  Сгенерировать ошибку
                </Button>
                
                <Button 
                  onClick={monitorElement}
                  variant="outline" 
                  className="w-full"
                >
                  Мониторить события
                </Button>

                <Button 
                  onClick={() => {
                    console.table([
                      { name: 'Elements', shortcut: 'Ctrl+Shift+C' },
                      { name: 'Console', shortcut: 'Ctrl+Shift+J' },
                      { name: 'Network', shortcut: 'Ctrl+Shift+E' }
                    ]);
                    setOutput(prev => [...prev, "Таблица отправлена в DevTools Console"]);
                  }}
                  variant="outline" 
                  className="w-full"
                >
                  Показать таблицу
                </Button>
                <p className="text-xs text-muted-foreground text-center mt-1">
                  Отображает таблицу с горячими клавишами DevTools в консоли браузера (F12)
                </p>
              </div>

              {/* Quick Commands */}
              <div className="space-y-2">
                <h5 className="font-semibold text-devtools-blue">💡 Попробуйте эти команды:</h5>
                <div className="text-xs space-y-1 font-mono bg-muted/50 p-3 rounded-lg">
                  <div>$0.style.border = '2px solid red'</div>
                  <div>$0.textContent = 'Изменено!'</div>
                  <div>console.log($0)</div>
                  <div>monitorEvents($0, 'click')</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tips */}
        <Card className="mt-8 bg-gradient-card shadow-card">
          <CardHeader>
            <CardTitle className="text-devtools-orange">💡 Советы по работе с Console</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <h4 className="font-semibold text-devtools-blue">Автодополнение</h4>
                <p className="text-sm text-muted-foreground">
                  Используйте Tab для автодополнения методов и свойств объектов
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-devtools-green">Фильтрация</h4>
                <p className="text-sm text-muted-foreground">
                  Фильтруйте логи по типу (Errors, Warnings, Info) в панели Console
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-devtools-purple">Многострочный код</h4>
                <p className="text-sm text-muted-foreground">
                  Shift+Enter для перехода на новую строку без выполнения кода
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Console;