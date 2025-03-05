/* ---------- Detailed Data for All Gang of Four Design Patterns ---------- */
const patterns = [
  {
    name: "Abstract Factory",
    category: "Creational",
    description:
      "Provides an interface for creating families of related objects without specifying their concrete classes. This pattern promotes consistency among products designed to work together.",
    image: "images/abstract_factory.png",
    codeExamples: {
      javascript:
`// Abstract Factory example in JavaScript
class Button {
  render() { console.log("Rendering a generic button."); }
}
class Checkbox {
  render() { console.log("Rendering a generic checkbox."); }
}
class GUIFactory {
  createButton() {}
  createCheckbox() {}
}
class WinButton extends Button {
  render() { console.log("Rendering a Windows button."); }
}
class WinCheckbox extends Checkbox {
  render() { console.log("Rendering a Windows checkbox."); }
}
class MacButton extends Button {
  render() { console.log("Rendering a Mac button."); }
}
class MacCheckbox extends Checkbox {
  render() { console.log("Rendering a Mac checkbox."); }
}
class WinFactory extends GUIFactory {
  createButton() { return new WinButton(); }
  createCheckbox() { return new WinCheckbox(); }
}
class MacFactory extends GUIFactory {
  createButton() { return new MacButton(); }
  createCheckbox() { return new MacCheckbox(); }
}
// Usage:
let factory = new WinFactory();
let btn = factory.createButton();
btn.render();`,
      java:
`// Abstract Factory example in Java
interface Button {
  void render();
}
interface Checkbox {
  void render();
}
abstract class GUIFactory {
  abstract Button createButton();
  abstract Checkbox createCheckbox();
}
class WinButton implements Button {
  public void render() { System.out.println("Rendering a Windows button."); }
}
class WinCheckbox implements Checkbox {
  public void render() { System.out.println("Rendering a Windows checkbox."); }
}
class MacButton implements Button {
  public void render() { System.out.println("Rendering a Mac button."); }
}
class MacCheckbox implements Checkbox {
  public void render() { System.out.println("Rendering a Mac checkbox."); }
}
class WinFactory extends GUIFactory {
  Button createButton() { return new WinButton(); }
  Checkbox createCheckbox() { return new WinCheckbox(); }
}
class MacFactory extends GUIFactory {
  Button createButton() { return new MacButton(); }
  Checkbox createCheckbox() { return new MacCheckbox(); }
}
// Usage:
GUIFactory factory = new WinFactory();
factory.createButton().render();`,
      python:
`# Abstract Factory example in Python
from abc import ABC, abstractmethod
class Button(ABC):
    @abstractmethod
    def render(self): pass
class Checkbox(ABC):
    @abstractmethod
    def render(self): pass
class GUIFactory(ABC):
    @abstractmethod
    def create_button(self): pass
    @abstractmethod
    def create_checkbox(self): pass
class WinButton(Button):
    def render(self): print("Rendering a Windows button.")
class WinCheckbox(Checkbox):
    def render(self): print("Rendering a Windows checkbox.")
class MacButton(Button):
    def render(self): print("Rendering a Mac button.")
class MacCheckbox(Checkbox):
    def render(self): print("Rendering a Mac checkbox.")
class WinFactory(GUIFactory):
    def create_button(self): return WinButton()
    def create_checkbox(self): return WinCheckbox()
class MacFactory(GUIFactory):
    def create_button(self): return MacButton()
    def create_checkbox(self): return MacCheckbox()
# Usage:
factory = WinFactory()
factory.create_button().render()`
    }
  },
  {
    name: "Builder",
    category: "Creational",
    description:
      "Separates the construction of a complex object from its representation. Useful when an object requires multiple steps to build.",
    image: "images/builder.png",
    codeExamples: {
      javascript:
`// Builder example in JavaScript
class House {
  constructor() { this.walls = 0; this.doors = 0; this.windows = 0; }
}
class HouseBuilder {
  constructor() { this.house = new House(); }
  buildWalls(n) { this.house.walls = n; return this; }
  buildDoors(n) { this.house.doors = n; return this; }
  buildWindows(n) { this.house.windows = n; return this; }
  getResult() { return this.house; }
}
// Usage:
const builder = new HouseBuilder();
const house = builder.buildWalls(4).buildDoors(2).buildWindows(6).getResult();
console.log(house);`,
      java:
`// Builder example in Java
class House {
  private int walls, doors, windows;
  public House(int walls, int doors, int windows) {
    this.walls = walls; this.doors = doors; this.windows = windows;
  }
  public String toString() {
    return "House[walls=" + walls + ", doors=" + doors + ", windows=" + windows + "]";
  }
}
class HouseBuilder {
  private int walls, doors, windows;
  public HouseBuilder setWalls(int walls) { this.walls = walls; return this; }
  public HouseBuilder setDoors(int doors) { this.doors = doors; return this; }
  public HouseBuilder setWindows(int windows) { this.windows = windows; return this; }
  public House build() { return new House(walls, doors, windows); }
}
// Usage:
House house = new HouseBuilder().setWalls(4).setDoors(2).setWindows(6).build();
System.out.println(house);`,
      python:
`# Builder example in Python
class House:
    def __init__(self, walls=0, doors=0, windows=0):
        self.walls = walls; self.doors = doors; self.windows = windows
    def __str__(self):
        return f"House[walls={self.walls}, doors={self.doors}, windows={self.windows}]"
class HouseBuilder:
    def __init__(self): self.house = House()
    def set_walls(self, walls):
        self.house.walls = walls; return self
    def set_doors(self, doors):
        self.house.doors = doors; return self
    def set_windows(self, windows):
        self.house.windows = windows; return self
    def build(self): return self.house
# Usage:
builder = HouseBuilder()
house = builder.set_walls(4).set_doors(2).set_windows(6).build()
print(house)`
    }
  },
  {
    name: "Factory Method",
    category: "Creational",
    description:
      "Defines an interface for creating an object, but lets subclasses decide which class to instantiate.",
    image: "images/factory_method.png",
    codeExamples: {
      javascript:
`// Factory Method example in JavaScript
class Document {}
class Resume extends Document {}
class Report extends Document {}
class DocumentCreator {
  factoryMethod(type) {
    if (type === 'resume') return new Resume();
    if (type === 'report') return new Report();
    throw new Error("Unknown type");
  }
}
// Usage:
const creator = new DocumentCreator();
const doc = creator.factoryMethod('resume');
console.log(doc);`,
      java:
`// Factory Method example in Java
abstract class Document {}
class Resume extends Document {}
class Report extends Document {}
abstract class DocumentCreator {
  public abstract Document factoryMethod(String type);
}
class ConcreteDocumentCreator extends DocumentCreator {
  public Document factoryMethod(String type) {
    if(type.equals("resume")) return new Resume();
    if(type.equals("report")) return new Report();
    throw new IllegalArgumentException("Unknown type");
  }
}
// Usage:
DocumentCreator creator = new ConcreteDocumentCreator();
Document doc = creator.factoryMethod("resume");`,
      python:
`# Factory Method example in Python
class Document: pass
class Resume(Document): pass
class Report(Document): pass
class DocumentCreator:
    def factory_method(self, type):
        if type == "resume":
            return Resume()
        elif type == "report":
            return Report()
        else:
            raise ValueError("Unknown type")
# Usage:
creator = DocumentCreator()
doc = creator.factory_method("resume")
print(doc)`
    }
  },
  {
    name: "Prototype",
    category: "Creational",
    description:
      "Creates new objects by copying a prototypical instance. Useful when object creation is expensive.",
    image: "images/prototype.png",
    codeExamples: {
      javascript:
`// Prototype example in JavaScript
class Prototype {
  constructor(value) { this.value = value; }
  clone() { return new Prototype(this.value); }
}
// Usage:
const original = new Prototype(42);
const copy = original.clone();
console.log(copy.value);`,
      java:
`// Prototype example in Java
class Prototype implements Cloneable {
  int value;
  public Prototype(int value) { this.value = value; }
  public Object clone() {
    return new Prototype(this.value);
  }
}
// Usage:
Prototype original = new Prototype(42);
Prototype copy = (Prototype) original.clone();
System.out.println(copy.value);`,
      python:
`# Prototype example in Python
import copy
class Prototype:
    def __init__(self, value):
        self.value = value
    def clone(self):
        return copy.deepcopy(self)
# Usage:
original = Prototype(42)
copy_obj = original.clone()
print(copy_obj.value)`
    }
  },
  {
    name: "Singleton",
    category: "Creational",
    description:
      "Ensures a class has only one instance and provides a global point of access to it.",
    image: "images/singleton.png",
    codeExamples: {
      javascript:
`// Singleton example in JavaScript
class Singleton {
  constructor(name) {
    if (Singleton.instance) return Singleton.instance;
    this.name = name;
    Singleton.instance = this;
  }
}
// Usage:
const a = new Singleton("First");
const b = new Singleton("Second");
console.log(a.name); // "First"
console.log(b.name); // "First"`,
      java:
`// Singleton example in Java
public class Singleton {
  private static Singleton instance;
  private String name;
  private Singleton(String name) { this.name = name; }
  public static Singleton getInstance(String name) {
    if(instance == null) instance = new Singleton(name);
    return instance;
  }
  public String getName() { return name; }
}
// Usage:
Singleton a = Singleton.getInstance("First");
Singleton b = Singleton.getInstance("Second");
System.out.println(a.getName()); // "First"`,
      python:
`# Singleton example in Python
class Singleton:
    _instance = None
    def __new__(cls, name):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance.name = name
        return cls._instance
# Usage:
a = Singleton("First")
b = Singleton("Second")
print(a.name)  # "First"`
    }
  },
  {
    name: "Adapter",
    category: "Structural",
    description:
      "Converts one interface into another expected by the client, allowing incompatible classes to work together.",
    image: "images/adapter.png",
    codeExamples: {
      javascript:
`// Adapter example in JavaScript
class OldCalculator {
  add(a, b) { return a + b; }
}
class CalculatorAdapter {
  constructor(oldCalc) { this.oldCalc = oldCalc; }
  add(a, b) { return this.oldCalc.add(a, b); }
  subtract(a, b) { return a - b; } // Emulated subtraction
}
// Usage:
const oldCalc = new OldCalculator();
const adapter = new CalculatorAdapter(oldCalc);
console.log(adapter.add(5, 3));
console.log(adapter.subtract(5, 3));`,
      java:
`// Adapter example in Java
class OldCalculator {
  public int add(int a, int b) { return a + b; }
}
interface NewCalculator {
  int add(int a, int b);
  int subtract(int a, int b);
}
class CalculatorAdapter implements NewCalculator {
  private OldCalculator oldCalc;
  public CalculatorAdapter(OldCalculator oldCalc) { this.oldCalc = oldCalc; }
  public int add(int a, int b) { return oldCalc.add(a, b); }
  public int subtract(int a, int b) { return a - b; }
}
// Usage:
OldCalculator oldCalc = new OldCalculator();
NewCalculator calc = new CalculatorAdapter(oldCalc);
System.out.println(calc.add(5,3));
System.out.println(calc.subtract(5,3));`,
      python:
`# Adapter example in Python
class OldCalculator:
    def add(self, a, b):
        return a + b
class CalculatorAdapter:
    def __init__(self, old_calc):
        self.old_calc = old_calc
    def add(self, a, b):
        return self.old_calc.add(a, b)
    def subtract(self, a, b):
        return a - b
# Usage:
old_calc = OldCalculator()
adapter = CalculatorAdapter(old_calc)
print(adapter.add(5,3))
print(adapter.subtract(5,3))`
    }
  },
  {
    name: "Bridge",
    category: "Structural",
    description:
      "Decouples an abstraction from its implementation so that both can vary independently.",
    image: "images/bridge.png",
    codeExamples: {
      javascript:
`// Bridge example in JavaScript
class TV {
  constructor() { this.volume = 10; }
  getVolume() { return this.volume; }
  setVolume(v) { this.volume = v; console.log("TV volume:", v); }
}
class Remote {
  constructor(device) { this.device = device; }
  volumeUp() { this.device.setVolume(this.device.getVolume() + 1); }
}
// Usage:
const tv = new TV();
const remote = new Remote(tv);
remote.volumeUp();`,
      java:
`// Bridge example in Java
interface Device {
  int getVolume();
  void setVolume(int volume);
}
class TV implements Device {
  private int volume = 10;
  public int getVolume() { return volume; }
  public void setVolume(int volume) { this.volume = volume; System.out.println("TV volume: " + volume); }
}
abstract class Remote {
  protected Device device;
  public Remote(Device device) { this.device = device; }
  public abstract void volumeUp();
}
class ConcreteRemote extends Remote {
  public ConcreteRemote(Device device) { super(device); }
  public void volumeUp() { device.setVolume(device.getVolume() + 1); }
}
// Usage:
Device tv = new TV();
Remote remote = new ConcreteRemote(tv);
remote.volumeUp();`,
      python:
`# Bridge example in Python
class TV:
    def __init__(self): self.volume = 10
    def get_volume(self): return self.volume
    def set_volume(self, v): self.volume = v; print("TV volume:", v)
class Remote:
    def __init__(self, device): self.device = device
    def volume_up(self): self.device.set_volume(self.device.get_volume() + 1)
# Usage:
tv = TV()
remote = Remote(tv)
remote.volume_up()`
    }
  },
  {
    name: "Composite",
    category: "Structural",
    description:
      "Composes objects into tree structures to represent part-whole hierarchies. Allows clients to treat individual objects and compositions uniformly.",
    image: "images/composite.png",
    codeExamples: {
      javascript:
`// Composite example in JavaScript
class Leaf {
  constructor(name) { this.name = name; }
  operation() { return this.name; }
}
class Composite {
  constructor() { this.children = []; }
  add(child) { this.children.push(child); }
  operation() { return this.children.map(c => c.operation()).join(", "); }
}
// Usage:
const leaf1 = new Leaf("Leaf1");
const leaf2 = new Leaf("Leaf2");
const composite = new Composite();
composite.add(leaf1); composite.add(leaf2);
console.log(composite.operation());`,
      java:
`// Composite example in Java
import java.util.*;
abstract class Component {
  public abstract String operation();
}
class Leaf extends Component {
  private String name;
  public Leaf(String name) { this.name = name; }
  public String operation() { return name; }
}
class Composite extends Component {
  private List<Component> children = new ArrayList<>();
  public void add(Component component) { children.add(component); }
  public String operation() {
    StringBuilder sb = new StringBuilder();
    for(Component child : children)
      sb.append(child.operation()).append(" ");
    return sb.toString();
  }
}
// Usage:
Composite composite = new Composite();
composite.add(new Leaf("Leaf1"));
composite.add(new Leaf("Leaf2"));
System.out.println(composite.operation());`,
      python:
`# Composite example in Python
class Leaf:
    def __init__(self, name): self.name = name
    def operation(self): return self.name
class Composite:
    def __init__(self): self.children = []
    def add(self, component): self.children.append(component)
    def operation(self):
        return ", ".join(child.operation() for child in self.children)
# Usage:
composite = Composite()
composite.add(Leaf("Leaf1"))
composite.add(Leaf("Leaf2"))
print(composite.operation())`
    }
  },
  {
    name: "Decorator",
    category: "Structural",
    description:
      "Attaches additional responsibilities to an object dynamically. Offers a flexible alternative to subclassing for extending functionality.",
    image: "images/decorator.png",
    codeExamples: {
      javascript:
`// Decorator example in JavaScript
class Coffee {
  cost() { return 2; }
}
class MilkDecorator {
  constructor(coffee) { this.coffee = coffee; }
  cost() { return this.coffee.cost() + 0.5; }
}
// Usage:
let coffee = new Coffee();
coffee = new MilkDecorator(coffee);
console.log(coffee.cost());`,
      java:
`// Decorator example in Java
abstract class Coffee {
  public abstract double cost();
}
class SimpleCoffee extends Coffee {
  public double cost() { return 2.0; }
}
abstract class CoffeeDecorator extends Coffee {
  protected Coffee coffee;
  public CoffeeDecorator(Coffee coffee) { this.coffee = coffee; }
}
class MilkDecorator extends CoffeeDecorator {
  public MilkDecorator(Coffee coffee) { super(coffee); }
  public double cost() { return coffee.cost() + 0.5; }
}
// Usage:
Coffee coffee = new MilkDecorator(new SimpleCoffee());
System.out.println(coffee.cost());`,
      python:
`# Decorator example in Python
class Coffee:
    def cost(self): return 2.0
class MilkDecorator(Coffee):
    def __init__(self, coffee): self.coffee = coffee
    def cost(self): return self.coffee.cost() + 0.5
# Usage:
coffee = MilkDecorator(Coffee())
print(coffee.cost())`
    }
  },
  {
    name: "Facade",
    category: "Structural",
    description:
      "Provides a simplified interface to a complex subsystem, reducing dependencies and simplifying usage.",
    image: "images/facade.png",
    codeExamples: {
      javascript:
`// Facade example in JavaScript
class CPU {
  freeze() { console.log("CPU freezing..."); }
  jump(position) { console.log("CPU jumping to", position); }
  execute() { console.log("CPU executing..."); }
}
class Memory {
  load(position, data) { console.log("Memory loading", data, "at", position); }
}
class HardDrive {
  read(lba, size) { return "data"; }
}
class ComputerFacade {
  constructor() {
    this.cpu = new CPU();
    this.memory = new Memory();
    this.hd = new HardDrive();
  }
  start() {
    this.cpu.freeze();
    this.memory.load(0, this.hd.read(0, 1024));
    this.cpu.jump(0);
    this.cpu.execute();
  }
}
// Usage:
let computer = new ComputerFacade();
computer.start();`,
      java:
`// Facade example in Java
class CPU {
  public void freeze() { System.out.println("CPU freezing..."); }
  public void jump(long position) { System.out.println("CPU jumping to " + position); }
  public void execute() { System.out.println("CPU executing..."); }
}
class Memory {
  public void load(long position, String data) { System.out.println("Memory loading " + data + " at " + position); }
}
class HardDrive {
  public String read(long lba, int size) { return "data"; }
}
class ComputerFacade {
  private CPU cpu = new CPU();
  private Memory memory = new Memory();
  private HardDrive hd = new HardDrive();
  public void start() {
    cpu.freeze();
    memory.load(0, hd.read(0, 1024));
    cpu.jump(0);
    cpu.execute();
  }
}
// Usage:
ComputerFacade computer = new ComputerFacade();
computer.start();`,
      python:
`# Facade example in Python
class CPU:
    def freeze(self): print("CPU freezing...")
    def jump(self, position): print("CPU jumping to", position)
    def execute(self): print("CPU executing...")
class Memory:
    def load(self, position, data): print("Memory loading", data, "at", position)
class HardDrive:
    def read(self, lba, size): return "data"
class ComputerFacade:
    def __init__(self):
        self.cpu = CPU()
        self.memory = Memory()
        self.hd = HardDrive()
    def start(self):
        self.cpu.freeze()
        self.memory.load(0, self.hd.read(0, 1024))
        self.cpu.jump(0)
        self.cpu.execute()
# Usage:
computer = ComputerFacade()
computer.start()`
    }
  },
  {
    name: "Flyweight",
    category: "Structural",
    description:
      "Minimizes memory usage by sharing as much data as possible with similar objects; it is useful when dealing with a large number of objects.",
    image: "images/flyweight.png",
    codeExamples: {
      javascript:
`// Flyweight example in JavaScript
class Flyweight {
  constructor(sharedState) { this.sharedState = sharedState; }
  operation(uniqueState) { console.log("Flyweight with", this.sharedState, "and", uniqueState); }
}
class FlyweightFactory {
  constructor() { this.flyweights = {}; }
  getFlyweight(key) {
    if (!this.flyweights[key]) { this.flyweights[key] = new Flyweight(key); }
    return this.flyweights[key];
  }
}
// Usage:
const factory = new FlyweightFactory();
const fly1 = factory.getFlyweight("shared");
fly1.operation("unique1");`,
      java:
`// Flyweight example in Java
import java.util.*;
class Flyweight {
  private String sharedState;
  public Flyweight(String sharedState) { this.sharedState = sharedState; }
  public void operation(String uniqueState) { System.out.println("Flyweight with " + sharedState + " and " + uniqueState); }
}
class FlyweightFactory {
  private Map<String, Flyweight> flyweights = new HashMap<>();
  public Flyweight getFlyweight(String key) {
    if (!flyweights.containsKey(key)) {
      flyweights.put(key, new Flyweight(key));
    }
    return flyweights.get(key);
  }
}
// Usage:
FlyweightFactory factory = new FlyweightFactory();
Flyweight fly1 = factory.getFlyweight("shared");
fly1.operation("unique1");`,
      python:
`# Flyweight example in Python
class Flyweight:
    def __init__(self, shared_state):
        self.shared_state = shared_state
    def operation(self, unique_state):
        print("Flyweight with", self.shared_state, "and", unique_state)
class FlyweightFactory:
    def __init__(self):
        self.flyweights = {}
    def get_flyweight(self, key):
        if key not in self.flyweights:
            self.flyweights[key] = Flyweight(key)
        return self.flyweights[key]
# Usage:
factory = FlyweightFactory()
fly1 = factory.get_flyweight("shared")
fly1.operation("unique1")`
    }
  },
  {
    name: "Proxy",
    category: "Structural",
    description:
      "Provides a surrogate or placeholder for another object to control access to it, for purposes such as lazy initialization or access control.",
    image: "images/proxy.png",
    codeExamples: {
      javascript:
`// Proxy example in JavaScript
class RealSubject {
  request() { console.log("RealSubject handling request."); }
}
class Proxy {
  constructor() { this.realSubject = null; }
  request() {
    if (!this.realSubject) { this.realSubject = new RealSubject(); }
    console.log("Proxy delegating request.");
    this.realSubject.request();
  }
}
// Usage:
const proxy = new Proxy();
proxy.request();`,
      java:
`// Proxy example in Java
class RealSubject {
  public void request() { System.out.println("RealSubject handling request."); }
}
class Proxy implements Subject {
  private RealSubject realSubject;
  public void request() {
    if(realSubject == null) realSubject = new RealSubject();
    System.out.println("Proxy delegating request.");
    realSubject.request();
  }
}
// Usage (assuming a Subject interface exists):
Proxy proxy = new Proxy();
proxy.request();`,
      python:
`# Proxy example in Python
class RealSubject:
    def request(self):
        print("RealSubject handling request.")
class Proxy:
    def __init__(self):
        self.real_subject = None
    def request(self):
        if self.real_subject is None:
            self.real_subject = RealSubject()
        print("Proxy delegating request.")
        self.real_subject.request()
# Usage:
proxy = Proxy()
proxy.request()`
    }
  },
  {
    name: "Chain of Responsibility",
    category: "Behavioral",
    description:
      "Passes a request along a chain of potential handlers until one handles it, decoupling the sender and receiver.",
    image: "images/chain_of_responsibility.png",
    codeExamples: {
      javascript:
`// Chain of Responsibility example in JavaScript
class Handler {
  setNext(handler) { this.next = handler; return handler; }
  handle(request) { if (this.next) return this.next.handle(request); }
}
class ConcreteHandlerA extends Handler {
  handle(request) {
    if (request < 10) { console.log("Handler A processed", request); return request; }
    return super.handle(request);
  }
}
class ConcreteHandlerB extends Handler {
  handle(request) {
    if (request >= 10) { console.log("Handler B processed", request); return request; }
    return super.handle(request);
  }
}
// Usage:
const handlerA = new ConcreteHandlerA();
const handlerB = new ConcreteHandlerB();
handlerA.setNext(handlerB);
handlerA.handle(5);
handlerA.handle(15);`,
      java:
`// Chain of Responsibility example in Java
abstract class Handler {
  protected Handler next;
  public Handler setNext(Handler handler) { this.next = handler; return handler; }
  public abstract void handle(int request);
}
class ConcreteHandlerA extends Handler {
  public void handle(int request) {
    if (request < 10) { System.out.println("Handler A processed " + request); }
    else if (next != null) { next.handle(request); }
  }
}
class ConcreteHandlerB extends Handler {
  public void handle(int request) {
    if (request >= 10) { System.out.println("Handler B processed " + request); }
    else if (next != null) { next.handle(request); }
  }
}
// Usage:
Handler handlerA = new ConcreteHandlerA();
Handler handlerB = new ConcreteHandlerB();
handlerA.setNext(handlerB);
handlerA.handle(5);
handlerA.handle(15);`,
      python:
`# Chain of Responsibility example in Python
class Handler:
    def __init__(self):
        self.next = None
    def set_next(self, handler):
        self.next = handler
        return handler
    def handle(self, request):
        if self.next:
            return self.next.handle(request)
class ConcreteHandlerA(Handler):
    def handle(self, request):
        if request < 10:
            print("Handler A processed", request)
            return request
        else:
            return super().handle(request)
class ConcreteHandlerB(Handler):
    def handle(self, request):
        if request >= 10:
            print("Handler B processed", request)
            return request
        else:
            return super().handle(request)
# Usage:
handlerA = ConcreteHandlerA()
handlerB = ConcreteHandlerB()
handlerA.set_next(handlerB)
handlerA.handle(5)
handlerA.handle(15)`
    }
  },
  {
    name: "Command",
    category: "Behavioral",
    description:
      "Encapsulates a request as an object, allowing parameterization of clients with different requests and support for undo/redo operations.",
    image: "images/command.png",
    codeExamples: {
      javascript:
`// Command example in JavaScript
class Command {
  execute() {}
}
class Light {
  on() { console.log("Light is on"); }
}
class LightOnCommand extends Command {
  constructor(light) { super(); this.light = light; }
  execute() { this.light.on(); }
}
// Usage:
const light = new Light();
const command = new LightOnCommand(light);
command.execute();`,
      java:
`// Command example in Java
interface Command {
  void execute();
}
class Light {
  public void on() { System.out.println("Light is on"); }
}
class LightOnCommand implements Command {
  private Light light;
  public LightOnCommand(Light light) { this.light = light; }
  public void execute() { light.on(); }
}
// Usage:
Light light = new Light();
Command command = new LightOnCommand(light);
command.execute();`,
      python:
`# Command example in Python
class Command:
    def execute(self): pass
class Light:
    def on(self): print("Light is on")
class LightOnCommand(Command):
    def __init__(self, light): self.light = light
    def execute(self): self.light.on()
# Usage:
light = Light()
command = LightOnCommand(light)
command.execute()`
    }
  },
  {
    name: "Interpreter",
    category: "Behavioral",
    description:
      "Defines a representation for a grammar and an interpreter that uses the representation to interpret sentences in the language.",
    image: "images/interpreter.png",
    codeExamples: {
      javascript:
`// Interpreter example in JavaScript (simple arithmetic)
class Expression {
  interpret() { return 0; }
}
class NumberExpression extends Expression {
  constructor(number) { super(); this.number = number; }
  interpret() { return this.number; }
}
class AddExpression extends Expression {
  constructor(left, right) { super(); this.left = left; this.right = right; }
  interpret() { return this.left.interpret() + this.right.interpret(); }
}
// Usage:
const expr = new AddExpression(new NumberExpression(5), new NumberExpression(3));
console.log(expr.interpret());`,
      java:
`// Interpreter example in Java (simple arithmetic)
interface Expression {
  int interpret();
}
class NumberExpression implements Expression {
  private int number;
  public NumberExpression(int number) { this.number = number; }
  public int interpret() { return number; }
}
class AddExpression implements Expression {
  private Expression left, right;
  public AddExpression(Expression left, Expression right) { this.left = left; this.right = right; }
  public int interpret() { return left.interpret() + right.interpret(); }
}
// Usage:
Expression expr = new AddExpression(new NumberExpression(5), new NumberExpression(3));
System.out.println(expr.interpret());`,
      python:
`# Interpreter example in Python (simple arithmetic)
class Expression:
    def interpret(self): pass
class NumberExpression(Expression):
    def __init__(self, number): self.number = number
    def interpret(self): return self.number
class AddExpression(Expression):
    def __init__(self, left, right):
        self.left = left; self.right = right
    def interpret(self): return self.left.interpret() + self.right.interpret()
# Usage:
expr = AddExpression(NumberExpression(5), NumberExpression(3))
print(expr.interpret())`
    }
  },
  {
    name: "Iterator",
    category: "Behavioral",
    description:
      "Provides a way to access the elements of an aggregate object sequentially without exposing its underlying representation.",
    image: "images/iterator.png",
    codeExamples: {
      javascript:
`// Iterator example in JavaScript
class Iterator {
  constructor(items) { this.items = items; this.index = 0; }
  next() { return this.items[this.index++]; }
  hasNext() { return this.index < this.items.length; }
}
// Usage:
const it = new Iterator([1,2,3]);
while(it.hasNext()) { console.log(it.next()); }`,
      java:
`// Iterator example in Java
import java.util.*;
class ArrayIterator implements Iterator<Integer> {
  private List<Integer> list;
  private int index = 0;
  public ArrayIterator(List<Integer> list) { this.list = list; }
  public boolean hasNext() { return index < list.size(); }
  public Integer next() { return list.get(index++); }
}
// Usage:
Iterator<Integer> it = new ArrayIterator(Arrays.asList(1,2,3));
while(it.hasNext()) { System.out.println(it.next()); }`,
      python:
`# Iterator example in Python
class MyIterator:
    def __init__(self, items):
        self.items = items; self.index = 0
    def __iter__(self): return self
    def __next__(self):
        if self.index < len(self.items):
            result = self.items[self.index]; self.index += 1; return result
        else:
            raise StopIteration
# Usage:
it = MyIterator([1,2,3])
for item in it:
    print(item)`
    }
  },
  {
    name: "Mediator",
    category: "Behavioral",
    description:
      "Defines an object that encapsulates how a set of objects interact, promoting loose coupling.",
    image: "images/mediator.png",
    codeExamples: {
      javascript:
`// Mediator example in JavaScript
class ChatRoom {
  showMessage(user, message) {
    const time = new Date();
    console.log(time + " [" + user + "]: " + message);
  }
}
// Usage:
const chat = new ChatRoom();
chat.showMessage("Alice", "Hello!");`,
      java:
`// Mediator example in Java
class ChatRoom {
  public void showMessage(String user, String message) {
    System.out.println("[" + user + "]: " + message);
  }
}
// Usage:
ChatRoom chat = new ChatRoom();
chat.showMessage("Alice", "Hello!");`,
      python:
`# Mediator example in Python
class ChatRoom:
    def show_message(self, user, message):
        print(f"[{user}]: {message}")
# Usage:
chat = ChatRoom()
chat.show_message("Alice", "Hello!")`
    }
  },
  {
    name: "Memento",
    category: "Behavioral",
    description:
      "Captures and externalizes an object's internal state so that it can be restored later, without violating encapsulation.",
    image: "images/memento.png",
    codeExamples: {
      javascript:
`// Memento example in JavaScript
class Memento {
  constructor(state) { this.state = state; }
  getState() { return this.state; }
}
class Originator {
  constructor() { this.state = ""; }
  setState(state) { this.state = state; }
  saveStateToMemento() { return new Memento(this.state); }
  getStateFromMemento(memento) { this.state = memento.getState(); }
}
// Usage:
const originator = new Originator();
originator.setState("State1");
const memento = originator.saveStateToMemento();
originator.setState("State2");
originator.getStateFromMemento(memento);
console.log(originator.state);`,
      java:
`// Memento example in Java
class Memento {
  private String state;
  public Memento(String state) { this.state = state; }
  public String getState() { return state; }
}
class Originator {
  private String state;
  public void setState(String state) { this.state = state; }
  public Memento saveStateToMemento() { return new Memento(state); }
  public void getStateFromMemento(Memento memento) { state = memento.getState(); }
  public String getState() { return state; }
}
// Usage:
Originator originator = new Originator();
originator.setState("State1");
Memento memento = originator.saveStateToMemento();
originator.setState("State2");
originator.getStateFromMemento(memento);
System.out.println(originator.getState());`,
      python:
`# Memento example in Python
class Memento:
    def __init__(self, state):
        self.state = state
    def get_state(self):
        return self.state
class Originator:
    def __init__(self):
        self.state = ""
    def set_state(self, state):
        self.state = state
    def save_state_to_memento(self):
        return Memento(self.state)
    def get_state_from_memento(self, memento):
        self.state = memento.get_state()
# Usage:
originator = Originator()
originator.set_state("State1")
memento = originator.save_state_to_memento()
originator.set_state("State2")
originator.get_state_from_memento(memento)
print(originator.state)`
    }
  },
  {
    name: "Observer",
    category: "Behavioral",
    description:
      "Defines a one-to-many dependency so that when one object changes state, all its dependents are notified.",
    image: "images/observer.png",
    codeExamples: {
      javascript:
`// Observer example in JavaScript
class Subject {
  constructor() { this.observers = []; }
  attach(observer) { this.observers.push(observer); }
  notify() { this.observers.forEach(o => o.update(this)); }
}
class ConcreteObserver {
  update(subject) { console.log("Observer notified with state:", subject.state); }
}
// Usage:
const subject = new Subject();
subject.state = "Some state";
const observer = new ConcreteObserver();
subject.attach(observer);
subject.notify();`,
      java:
`// Observer example in Java
import java.util.*;
interface Observer {
  void update(String state);
}
class ConcreteObserver implements Observer {
  public void update(String state) { System.out.println("Observer notified with state: " + state); }
}
class Subject {
  private List<Observer> observers = new ArrayList<>();
  private String state;
  public void attach(Observer observer) { observers.add(observer); }
  public void setState(String state) { this.state = state; notifyAllObservers(); }
  public void notifyAllObservers() {
    for(Observer observer : observers)
      observer.update(state);
  }
}
// Usage:
Subject subject = new Subject();
subject.attach(new ConcreteObserver());
subject.setState("Some state");`,
      python:
`# Observer example in Python
class Subject:
    def __init__(self):
        self.observers = []
        self.state = ""
    def attach(self, observer):
        self.observers.append(observer)
    def set_state(self, state):
        self.state = state
        self.notify_all()
    def notify_all(self):
        for observer in self.observers:
            observer.update(self.state)
class ConcreteObserver:
    def update(self, state):
        print("Observer notified with state:", state)
# Usage:
subject = Subject()
observer = ConcreteObserver()
subject.attach(observer)
subject.set_state("Some state")`
    }
  },
  {
    name: "State",
    category: "Behavioral",
    description:
      "Allows an object to alter its behavior when its internal state changes. Encapsulates state-specific behavior.",
    image: "images/state.png",
    codeExamples: {
      javascript:
`// State example in JavaScript
class Context {
  constructor() { this.state = null; }
  setState(state) { this.state = state; }
  request() { this.state.handle(); }
}
class ConcreteStateA {
  handle() { console.log("State A handling request."); }
}
class ConcreteStateB {
  handle() { console.log("State B handling request."); }
}
// Usage:
const context = new Context();
context.setState(new ConcreteStateA());
context.request();
context.setState(new ConcreteStateB());
context.request();`,
      java:
`// State example in Java
interface State {
  void handle();
}
class ConcreteStateA implements State {
  public void handle() { System.out.println("State A handling request."); }
}
class ConcreteStateB implements State {
  public void handle() { System.out.println("State B handling request."); }
}
class Context {
  private State state;
  public void setState(State state) { this.state = state; }
  public void request() { state.handle(); }
}
// Usage:
Context context = new Context();
context.setState(new ConcreteStateA());
context.request();
context.setState(new ConcreteStateB());
context.request();`,
      python:
`# State example in Python
class Context:
    def __init__(self): self.state = None
    def set_state(self, state): self.state = state
    def request(self): self.state.handle()
class ConcreteStateA:
    def handle(self): print("State A handling request.")
class ConcreteStateB:
    def handle(self): print("State B handling request.")
# Usage:
context = Context()
context.set_state(ConcreteStateA())
context.request()
context.set_state(ConcreteStateB())
context.request()`
    }
  },
  {
    name: "Strategy",
    category: "Behavioral",
    description:
      "Defines a family of algorithms, encapsulates each one, and makes them interchangeable. Enables the algorithm to vary independently from clients.",
    image: "images/strategy.png",
    codeExamples: {
      javascript:
`// Strategy example in JavaScript
class Strategy {
  execute(a, b) { return 0; }
}
class AddStrategy extends Strategy {
  execute(a, b) { return a + b; }
}
class MultiplyStrategy extends Strategy {
  execute(a, b) { return a * b; }
}
class Context {
  setStrategy(strategy) { this.strategy = strategy; }
  executeStrategy(a, b) { return this.strategy.execute(a, b); }
}
// Usage:
const context = new Context();
context.setStrategy(new AddStrategy());
console.log(context.executeStrategy(3, 4));
context.setStrategy(new MultiplyStrategy());
console.log(context.executeStrategy(3, 4));`,
      java:
`// Strategy example in Java
interface Strategy {
  int execute(int a, int b);
}
class AddStrategy implements Strategy {
  public int execute(int a, int b) { return a + b; }
}
class MultiplyStrategy implements Strategy {
  public int execute(int a, int b) { return a * b; }
}
class Context {
  private Strategy strategy;
  public void setStrategy(Strategy strategy) { this.strategy = strategy; }
  public int executeStrategy(int a, int b) { return strategy.execute(a, b); }
}
// Usage:
Context context = new Context();
context.setStrategy(new AddStrategy());
System.out.println(context.executeStrategy(3,4));
context.setStrategy(new MultiplyStrategy());
System.out.println(context.executeStrategy(3,4));`,
      python:
`# Strategy example in Python
class Strategy:
    def execute(self, a, b): pass
class AddStrategy(Strategy):
    def execute(self, a, b): return a + b
class MultiplyStrategy(Strategy):
    def execute(self, a, b): return a * b
class Context:
    def set_strategy(self, strategy): self.strategy = strategy
    def execute_strategy(self, a, b): return self.strategy.execute(a, b)
# Usage:
context = Context()
context.set_strategy(AddStrategy())
print(context.execute_strategy(3,4))
context.set_strategy(MultiplyStrategy())
print(context.execute_strategy(3,4))`
    }
  },
  {
    name: "Template Method",
    category: "Behavioral",
    description:
      "Defines the skeleton of an algorithm, deferring some steps to subclasses. Allows subclasses to redefine certain steps without changing the overall algorithm.",
    image: "images/template_method.png",
    codeExamples: {
      javascript:
`// Template Method example in JavaScript
class AbstractClass {
  templateMethod() {
    this.stepOne();
    this.stepTwo();
  }
  stepOne() { console.log("Step one"); }
  stepTwo() { console.log("Step two"); }
}
class ConcreteClass extends AbstractClass {
  stepOne() { console.log("Concrete step one"); }
  stepTwo() { console.log("Concrete step two"); }
}
// Usage:
const obj = new ConcreteClass();
obj.templateMethod();`,
      java:
`// Template Method example in Java
abstract class AbstractClass {
  public void templateMethod() {
    stepOne();
    stepTwo();
  }
  protected abstract void stepOne();
  protected abstract void stepTwo();
}
class ConcreteClass extends AbstractClass {
  protected void stepOne() { System.out.println("Concrete step one"); }
  protected void stepTwo() { System.out.println("Concrete step two"); }
}
// Usage:
AbstractClass obj = new ConcreteClass();
obj.templateMethod();`,
      python:
`# Template Method example in Python
class AbstractClass:
    def template_method(self):
        self.step_one()
        self.step_two()
    def step_one(self): pass
    def step_two(self): pass
class ConcreteClass(AbstractClass):
    def step_one(self): print("Concrete step one")
    def step_two(self): print("Concrete step two")
# Usage:
obj = ConcreteClass()
obj.template_method()`
    }
  },
  {
    name: "Visitor",
    category: "Behavioral",
    description:
      "Represents an operation to be performed on the elements of an object structure, letting you define new operations without changing the classes of the elements.",
    image: "images/visitor.png",
    codeExamples: {
      javascript:
`// Visitor example in JavaScript
class Element {
  accept(visitor) { visitor.visit(this); }
}
class ConcreteElementA extends Element {
  operationA() { return "Element A"; }
}
class ConcreteVisitor {
  visit(element) {
    if(element instanceof ConcreteElementA) {
      console.log("Visitor: " + element.operationA());
    }
  }
}
// Usage:
const element = new ConcreteElementA();
const visitor = new ConcreteVisitor();
element.accept(visitor);`,
      java:
`// Visitor example in Java
interface Element {
  void accept(Visitor visitor);
}
class ConcreteElementA implements Element {
  public String operationA() { return "Element A"; }
  public void accept(Visitor visitor) { visitor.visit(this); }
}
interface Visitor {
  void visit(ConcreteElementA element);
}
class ConcreteVisitor implements Visitor {
  public void visit(ConcreteElementA element) {
    System.out.println("Visitor: " + element.operationA());
  }
}
// Usage:
Element element = new ConcreteElementA();
Visitor visitor = new ConcreteVisitor();
element.accept(visitor);`,
      python:
`# Visitor example in Python
class Element:
    def accept(self, visitor):
        visitor.visit(self)
class ConcreteElementA(Element):
    def operation_a(self):
        return "Element A"
class ConcreteVisitor:
    def visit(self, element):
        if isinstance(element, ConcreteElementA):
            print("Visitor:", element.operation_a())
# Usage:
element = ConcreteElementA()
visitor = ConcreteVisitor()
element.accept(visitor)`
    }
  }
];

/* ---------- Utility Functions ---------- */
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

/* ---------- Flashcards Section ---------- */
const flashcardsContainer = document.getElementById("flashcardsContainer");
const categoryFilter = document.getElementById("categoryFilter");
const flashcardSearch = document.getElementById("flashcardSearch");

function createFlashcard(pattern) {
  const card = document.createElement("div");
  card.className = "flashcard";
  card.dataset.pattern = pattern.name.toLowerCase();

  const inner = document.createElement("div");
  inner.className = "card-inner";

  const front = document.createElement("div");
  front.className = "card-front";
  const title = document.createElement("h3");
  title.textContent = pattern.name;
  front.appendChild(title);

  const back = document.createElement("div");
  back.className = "card-back";
  const desc = document.createElement("p");
  desc.textContent = pattern.description;
  back.appendChild(desc);
  if (pattern.image) {
    const img = document.createElement("img");
    img.src = pattern.image;
    img.alt = pattern.name + " Pattern";
    back.appendChild(img);
  }

  inner.appendChild(front);
  inner.appendChild(back);
  card.appendChild(inner);

  card.addEventListener("click", () => {
    card.classList.toggle("active");
  });

  return card;
}

function loadFlashcards(filter = "All", searchQuery = "") {
  flashcardsContainer.innerHTML = "";
  const filteredPatterns = patterns.filter((pattern) => {
    const matchesCategory = filter === "All" || pattern.category === filter;
    const matchesSearch = pattern.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });
  filteredPatterns.forEach((pattern) => {
    flashcardsContainer.appendChild(createFlashcard(pattern));
  });
}

loadFlashcards();
categoryFilter.addEventListener("change", (e) => {
  loadFlashcards(e.target.value, flashcardSearch.value);
});
flashcardSearch.addEventListener("input", (e) => {
  loadFlashcards(categoryFilter.value, e.target.value);
});

/* ---------- Quiz Game Section ---------- */
const timerDisplay = document.getElementById("timer");
const scoreDisplay = document.getElementById("score");
const bestScoreDisplay = document.getElementById("bestScore");
const quizQuestionElem = document.getElementById("quizQuestion");
const quizOptionsElem = document.getElementById("quizOptions");
const resetGameBtn = document.getElementById("resetGame");

let currentScore = 0;
let bestScore = localStorage.getItem("bestScore") || 0;
let timerInterval;
let timeLeft = 60;
let gameOver = false;

bestScoreDisplay.textContent = `Best Score: ${bestScore}`;

function updateScore() {
  scoreDisplay.textContent = `Score: ${currentScore}`;
}

function updateTimer() {
  timerDisplay.textContent = `Time Left: ${timeLeft}s`;
}

function startTimer() {
  clearInterval(timerInterval);
  timeLeft = 60;
  updateTimer();
  gameOver = false;
  timerInterval = setInterval(() => {
    timeLeft--;
    updateTimer();
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      gameOver = true;
      document.getElementById("finalScoreText").textContent = `Your final score is: ${currentScore}`;
      document.getElementById("gameOverModal").style.display = "block";
      document.querySelectorAll(".quiz-options button").forEach((btn) => {
        btn.disabled = true;
      });
    }
  }, 1000);
}

/* ---------- Quiz Question Generation ---------- */
function generateQuestion() {
  // Decide question type: "name" (ask for description), "description" (ask for name), or "code" (code snippet question)
  let questionType;
  const rand = Math.random();
  if (rand < 0.33) { questionType = "code"; }
  else if (rand < 0.66) { questionType = "name"; }
  else { questionType = "description"; }
  
  const correctPattern = patterns[Math.floor(Math.random() * patterns.length)];
  let questionText = "";
  let correctOption = "";
  let options = [];
  let codeSnippet = null;
  
  if (questionType === "name") {
    questionText = `What is the correct detailed description for "${correctPattern.name}"?`;
    correctOption = correctPattern.description;
    const distractors = shuffle(
      patterns.filter(p => p.name !== correctPattern.name)
    ).slice(0, 3).map(p => p.description);
    options = [correctOption, ...distractors];
  } else if (questionType === "description") {
    questionText = `Which design pattern matches the detailed description:\n"${correctPattern.description}"?`;
    correctOption = correctPattern.name;
    const distractors = shuffle(
      patterns.filter(p => p.name !== correctPattern.name)
    ).slice(0, 3).map(p => p.name);
    options = [correctOption, ...distractors];
  } else if (questionType === "code") {
    const languages = ["javascript", "java", "python"];
    const language = languages[Math.floor(Math.random() * languages.length)];
    codeSnippet = correctPattern.codeExamples[language];
    questionText = `Which design pattern is illustrated by the following ${language.toUpperCase()} code snippet?`;
    correctOption = correctPattern.name;
    const distractors = shuffle(
      patterns.filter(p => p.name !== correctPattern.name)
    ).slice(0, 3).map(p => p.name);
    options = [correctOption, ...distractors];
  }
  
  options = shuffle(options);
  
  return { questionText, options, correctAnswer: correctOption, codeSnippet };
}

function displayQuestion(questionObj) {
  quizQuestionElem.innerHTML = "";
  quizOptionsElem.innerHTML = "";
  
  const questionPara = document.createElement("p");
  questionPara.textContent = questionObj.questionText;
  quizQuestionElem.appendChild(questionPara);
  
  if (questionObj.codeSnippet) {
    const pre = document.createElement("pre");
    pre.className = "code-snippet";
    const code = document.createElement("code");
    code.textContent = questionObj.codeSnippet;
    pre.appendChild(code);
    quizQuestionElem.appendChild(pre);
  }
  
  questionObj.options.forEach(optionText => {
    const btn = document.createElement("button");
    btn.textContent = optionText;
    btn.addEventListener("click", () => {
      if (gameOver || btn.disabled) return;
      
      if (optionText === questionObj.correctAnswer) {
        btn.classList.add("correct");
        currentScore++;
        updateScore();
        if (currentScore > bestScore) {
          bestScore = currentScore;
          bestScoreDisplay.textContent = `Best Score: ${bestScore}`;
          localStorage.setItem("bestScore", bestScore);
        }
      } else {
        btn.classList.add("incorrect");
      }
      
      document.querySelectorAll("#quizOptions button").forEach(b => b.disabled = true);
      
      setTimeout(() => {
        if (!gameOver) nextQuestion();
      }, 800);
    });
    quizOptionsElem.appendChild(btn);
  });
}

function nextQuestion() {
  const questionObj = generateQuestion();
  displayQuestion(questionObj);
}

function loadQuizGame() {
  currentScore = 0;
  updateScore();
  gameOver = false;
  quizQuestionElem.textContent = "";
  quizOptionsElem.innerHTML = "";
  clearInterval(timerInterval);
  timeLeft = 60;
  updateTimer();
  startTimer();
  nextQuestion();
}

/* ---------- Event Listeners for Quiz Game ---------- */
resetGameBtn.addEventListener("click", () => { loadQuizGame(); });

/* ---------- Modal Functionality ---------- */
const instructionsBtn = document.getElementById("instructionsBtn");
const instructionsModal = document.getElementById("instructionsModal");
const closeInstructions = document.getElementById("closeInstructions");
const startGameBtn = document.getElementById("startGame");
const gameOverModal = document.getElementById("gameOverModal");
const playAgainBtn = document.getElementById("playAgain");

instructionsBtn.addEventListener("click", () => { instructionsModal.style.display = "block"; });
if (closeInstructions) { closeInstructions.addEventListener("click", () => { instructionsModal.style.display = "none"; }); }
startGameBtn.addEventListener("click", () => { instructionsModal.style.display = "none"; loadQuizGame(); });
playAgainBtn.addEventListener("click", () => { gameOverModal.style.display = "none"; loadQuizGame(); });
window.addEventListener("click", (event) => {
  if (event.target === instructionsModal) { instructionsModal.style.display = "none"; }
  if (event.target === gameOverModal) { gameOverModal.style.display = "none"; }
});

/* ---------- Dark Mode Toggle ---------- */
const toggleDarkModeBtn = document.getElementById("toggleDarkMode");
toggleDarkModeBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  if (document.body.classList.contains("dark-mode")) { localStorage.setItem("darkMode", "enabled"); }
  else { localStorage.setItem("darkMode", "disabled"); }
});
if (localStorage.getItem("darkMode") === "enabled") { document.body.classList.add("dark-mode"); }
