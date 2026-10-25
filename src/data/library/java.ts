import { Subject } from './types';
import { SUBJECT_NAMES } from '../../config';

export const java: Subject = {
  id: 'java',
  name: SUBJECT_NAMES.java,
  items: [
  {
    "id": "j1",
    "expNo": "1.1",
    "title": "Count Numbers",
    "language": "java",
    "files": [
      {
        "name": "Main.java",
        "code": "class Numbers {\n    int[] arr = {10, -5, 0, 8, -2, 15, 0};\n    void countNumbers() {\n        int positive = 0;\n        int negative = 0;\n        int zero = 0;\n        for (int i = 0; i < arr.length; i++) {\n            if (arr[i] > 0) {\n                positive++;\n            } else if (arr[i] < 0) {\n                negative++;\n            } else {\n                zero++;\n            }\n        }\n        System.out.println(\"Positive = \" + positive);\n        System.out.println(\"Negative = \" + negative);\n        System.out.println(\"Zero = \" + zero);\n    }\n}\n\npublic class CountDemo {\n    public static void main(String[] args) {\n        Numbers n = new Numbers();\n        n.countNumbers();\n    }\n}"
      }
    ],
    "mainFile": "Main.java",
    "sampleInput": "",
    "savedOutput": "Positive = 3\nNegative = 2\nZero = 2",
    "mode": "console"
  },
  {
    "id": "j2",
    "expNo": "1.2",
    "title": "Prime Number",
    "language": "java",
    "files": [
      {
        "name": "Main.java",
        "code": "import java.util.Scanner;\n\nclass Prime {\n    int num;\n    void getData() {\n        Scanner sc = new Scanner(System.in);\n        System.out.print(\"Enter Number: \");\n        num = sc.nextInt();\n    }\n    void checkPrime() {\n        int count = 0;\n        for (int i = 1; i <= num; i++) {\n            if (num % i == 0)\n                count++;\n        }\n        if (count == 2)\n            System.out.println(\"Prime Number\");\n        else\n            System.out.println(\"Not Prime Number\");\n    }\n}\n\npublic class PrimeDemo {\n    public static void main(String args[]) {\n        Prime p = new Prime();\n        p.getData();\n        p.checkPrime();\n    }\n}"
      }
    ],
    "mainFile": "Main.java",
    "sampleInput": "7",
    "savedOutput": "Enter Number: 7\nPrime Number",
    "mode": "console"
  },
  {
    "id": "j3",
    "expNo": "1.3",
    "title": "Student Encapsulation",
    "language": "java",
    "files": [
      {
        "name": "Main.java",
        "code": "class Student {\n    private int rollNo;\n    private String name;\n    private double marks;\n\n    public void setRollNo(int rollNo) {\n        this.rollNo = rollNo;\n    }\n    public int getRollNo() {\n        return rollNo;\n    }\n    public void setName(String name) {\n        this.name = name;\n    }\n    public String getName() {\n        return name;\n    }\n    public void setMarks(double marks) {\n        this.marks = marks;\n    }\n    public double getMarks() {\n        return marks;\n    }\n}\n\npublic class StudentDemo {\n    public static void main(String[] args) {\n        Student student = new Student();\n        student.setRollNo(101);\n        student.setName(\"Siddhant Surve\");\n        student.setMarks(9.0);\n        System.out.println(\"Roll No = \" + student.getRollNo());\n        System.out.println(\"Name = \" + student.getName());\n        System.out.println(\"Marks = \" + student.getMarks());\n    }\n}"
      }
    ],
    "mainFile": "Main.java",
    "sampleInput": "",
    "savedOutput": "Roll No = 101\nName = Siddhant Surve\nMarks = 9.0",
    "mode": "console"
  },
  {
    "id": "j4",
    "expNo": "2.1",
    "title": "Method Overloading",
    "language": "java",
    "files": [
      {
        "name": "Main.java",
        "code": "class MethodOverloading {\n    void display() {\n        System.out.println(\"No parameters\");\n    }\n    void display(int a) {\n        System.out.println(\"Integer value: \" + a);\n    }\n    void display(int a, int b) {\n        System.out.println(\"Sum = \" + (a + b));\n    }\n    void display(String name) {\n        System.out.println(\"Name: \" + name);\n    }\n    public static void main(String[] args) {\n        MethodOverloading obj = new MethodOverloading();\n        obj.display();\n        obj.display(10);\n        obj.display(20, 30);\n        obj.display(\"SAM\");\n    }\n}"
      }
    ],
    "mainFile": "Main.java",
    "sampleInput": "",
    "savedOutput": "No parameters\nInteger value: 10\nSum = 50\nName: SAM",
    "mode": "console"
  },
  {
    "id": "j5",
    "expNo": "2.2",
    "title": "Constructor Overloading",
    "language": "java",
    "files": [
      {
        "name": "Main.java",
        "code": "class Area {\n    Area() {\n        System.out.println(\"Default Constructor\");\n    }\n    Area(int side) {\n        System.out.println(\"Area of Square = \" + (side * side));\n    }\n    Area(int length, int breadth) {\n        System.out.println(\"Area of Rectangle = \" + (length * breadth));\n    }\n    public static void main(String[] args) {\n        new Area();\n        new Area(5);\n        new Area(10, 4);\n    }\n}"
      }
    ],
    "mainFile": "Main.java",
    "sampleInput": "",
    "savedOutput": "Default Constructor\nArea of Square = 25\nArea of Rectangle = 40",
    "mode": "console"
  },
  {
    "id": "j6",
    "expNo": "3",
    "title": "Abstract Class – Area of Different Shapes",
    "language": "java",
    "files": [
      {
        "name": "Main.java",
        "code": "import java.util.Scanner;\n\nabstract class Shape {\n    abstract void area();\n}\n\nclass Circle extends Shape {\n    double r;\n    Circle(double r) { this.r = r; }\n    void area() { System.out.println(\"Area of Circle = \" + (3.14 * r * r)); }\n}\n\nclass Rectangle extends Shape {\n    double l, w;\n    Rectangle(double l, double w) { this.l = l; this.w = w; }\n    void area() { System.out.println(\"Area of Rectangle = \" + (l * w)); }\n}\n\nclass Triangle extends Shape {\n    double b, h;\n    Triangle(double b, double h) { this.b = b; this.h = h; }\n    void area() { System.out.println(\"Area of Triangle = \" + (0.5 * b * h)); }\n}\n\nclass Square extends Shape {\n    double s;\n    Square(double s) { this.s = s; }\n    void area() { System.out.println(\"Area of Square = \" + (s * s)); }\n}\n\nclass AbstractShape {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        Shape s;\n        System.out.print(\"Enter Radius of Circle: \");\n        s = new Circle(sc.nextDouble());\n        s.area();\n        System.out.print(\"\\nEnter Length and Width of Rectangle: \");\n        s = new Rectangle(sc.nextDouble(), sc.nextDouble());\n        s.area();\n        System.out.print(\"\\nEnter Base and Height of Triangle: \");\n        s = new Triangle(sc.nextDouble(), sc.nextDouble());\n        s.area();\n        System.out.print(\"\\nEnter Side of Square: \");\n        s = new Square(sc.nextDouble());\n        s.area();\n        sc.close();\n    }\n}"
      }
    ],
    "mainFile": "Main.java",
    "sampleInput": "5\n10 4\n8 6\n5",
    "savedOutput": "Enter Radius of Circle: 5\nArea of Circle = 78.5\n\nEnter Length and Width of Rectangle: 10 4\nArea of Rectangle = 40.0\n\nEnter Base and Height of Triangle: 8 6\nArea of Triangle = 24.0\n\nEnter Side of Square: 5\nArea of Square = 25.0",
    "mode": "console"
  },
  {
    "id": "j7",
    "expNo": "4.1",
    "title": "Method Overriding (Bank Interest Rate System)",
    "language": "java",
    "files": [
      {
        "name": "Main.java",
        "code": "import java.util.Scanner;\n\n// Parent Class\nclass Bank {\n    void getInterestRate() {\n        System.out.println(\"Interest Rate: 5%\");\n    }\n}\n\n// Child Class 1\nclass SBI extends Bank {\n    @Override\n    void getInterestRate() {\n        System.out.println(\"SBI Interest Rate: 6.5%\");\n    }\n}\n\n// Child Class 2\nclass HDFC extends Bank {\n    @Override\n    void getInterestRate() {\n        System.out.println(\"HDFC Interest Rate: 7%\");\n    }\n}\n\n// Child Class 3\nclass ICICI extends Bank {\n    @Override\n    void getInterestRate() {\n        System.out.println(\"ICICI Interest Rate: 6.8%\");\n    }\n}\n\n// Main Class\npublic class MethodOverridingDemo {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        Bank bank;\n        char choiceAgain;\n        do {\n            System.out.println(\"\\n===== Bank Interest Rate System =====\");\n            System.out.println(\"1. SBI\");\n            System.out.println(\"2. HDFC\");\n            System.out.println(\"3. ICICI\");\n            System.out.print(\"Enter your choice: \");\n            int choice = sc.nextInt();\n            switch (choice) {\n                case 1:\n                    bank = new SBI();\n                    break;\n                case 2:\n                    bank = new HDFC();\n                    break;\n                case 3:\n                    bank = new ICICI();\n                    break;\n                default:\n                    bank = new Bank();\n                    System.out.println(\"Invalid choice! Displaying default interest rate.\");\n            }\n            // Runtime Polymorphism\n            bank.getInterestRate();\n            System.out.print(\"\\nDo you want to check another bank's interest rate? (Y/N): \");\n            choiceAgain = sc.next().charAt(0);\n        } while (choiceAgain == 'Y' || choiceAgain == 'y');\n        System.out.println(\"\\nThank you for using the Bank Interest Rate System!\");\n        sc.close();\n    }\n}"
      }
    ],
    "mainFile": "Main.java",
    "sampleInput": "1\nn",
    "savedOutput": "===== Bank Interest Rate System =====\n1. SBI\n2. HDFC\n3. ICICI\nEnter your choice: 1\nSBI Interest Rate: 6.5%\n\nDo you want to check another bank's interest rate? (Y/N): n\n\nThank you for using the Bank Interest Rate System!",
    "mode": "console"
  },
  {
    "id": "j8",
    "expNo": "4.2",
    "title": "Method Overriding (Person Details)",
    "language": "java",
    "files": [
      {
        "name": "Main.java",
        "code": "class Person {\n    void displayDetails() {\n        System.out.println(\"I am a Person.\");\n    }\n}\n\nclass Student extends Person {\n    @Override\n    void displayDetails() {\n        System.out.println(\"I am a Student.\");\n    }\n}\n\nclass Teacher extends Person {\n    @Override\n    void displayDetails() {\n        System.out.println(\"I am a Teacher.\");\n    }\n}\n\npublic class PersonDemo {\n    public static void main(String[] args) {\n        Person person;\n        // Student object\n        person = new Student();\n        person.displayDetails();\n        // Teacher object\n        person = new Teacher();\n        person.displayDetails();\n    }\n}"
      }
    ],
    "mainFile": "Main.java",
    "sampleInput": "",
    "savedOutput": "I am a Student.\nI am a Teacher.",
    "mode": "console"
  },
  {
    "id": "j9",
    "expNo": "4.3",
    "title": "Method Overriding (Animal & Dog)",
    "language": "java",
    "files": [
      {
        "name": "Main.java",
        "code": "class Animal {\n    public void eat() {\n        System.out.println(\"Animal eats\");\n    }\n}\n\nclass Dog extends Animal {\n    @Override\n    public void eat() {\n        System.out.println(\"Dog eats\");\n    }\n}\n\npublic class MethodOverriding {\n    public static void main(String[] args) {\n        Animal a = new Animal();\n        a.eat();\n        Dog d = new Dog();\n        d.eat();\n    }\n}"
      }
    ],
    "mainFile": "Main.java",
    "sampleInput": "",
    "savedOutput": "Animal eats\nDog eats",
    "mode": "console"
  },
  {
    "id": "j10",
    "expNo": "5.1",
    "title": "Programs on Various Types of Inheritance",
    "language": "java",
    "files": [
      {
        "name": "Main.java",
        "code": "class Animal {\n    void eat() {\n        System.out.println(\"Animal eats\");\n    }\n}\n\nclass Dog extends Animal {\n    void bark() {\n        System.out.println(\"Dog barks\");\n    }\n}\n\nclass Puppy extends Dog {\n    void play() {\n        System.out.println(\"Puppy plays\");\n    }\n}\n\nclass Cat extends Animal {\n    void meow() {\n        System.out.println(\"Cat meows\");\n    }\n}\n\ninterface Pet {\n    void petSound();\n}\n\ninterface Friendly {\n    void friendly();\n}\n\nclass Cow extends Animal implements Pet, Friendly {\n    public void petSound() {\n        System.out.println(\"Cow says Moo\");\n    }\n    public void friendly() {\n        System.out.println(\"Cow is friendly\");\n    }\n}\n\npublic class AllInheritance {\n    public static void main(String[] args) {\n        System.out.println(\"----- Single Inheritance -----\");\n        Dog d = new Dog();\n        d.eat();\n        d.bark();\n        System.out.println(\"\\n----- Multilevel Inheritance -----\");\n        Puppy p = new Puppy();\n        p.eat();\n        p.bark();\n        p.play();\n        System.out.println(\"\\n----- Hierarchical Inheritance -----\");\n        Cat c = new Cat();\n        c.eat();\n        c.meow();\n        System.out.println(\"\\n----- Multiple Inheritance -----\");\n        Cow cow = new Cow();\n        cow.petSound();\n        cow.friendly();\n        System.out.println(\"\\n----- Hybrid Inheritance -----\");\n        cow.eat();\n        cow.petSound();\n        cow.friendly();\n    }\n}"
      }
    ],
    "mainFile": "Main.java",
    "sampleInput": "",
    "savedOutput": "----- Single Inheritance -----\nAnimal eats\nDog barks\n\n----- Multilevel Inheritance -----\nAnimal eats\nDog barks\nPuppy plays\n\n----- Hierarchical Inheritance -----\nAnimal eats\nCat meows\n\n----- Multiple Inheritance -----\nCow says Moo\nCow is friendly\n\n----- Hybrid Inheritance -----\nAnimal eats\nCow says Moo\nCow is friendly",
    "mode": "console"
  },
  {
    "id": "j11",
    "expNo": "5.2",
    "title": "Exception Handling",
    "language": "java",
    "files": [
      {
        "name": "Main.java",
        "code": "import java.util.Scanner;\n\nclass AgeException extends Exception {\n    AgeException(String msg) {\n        super(msg);\n    }\n}\n\npublic class AllExceptionHandling {\n    static void checkAge(int age) throws AgeException {\n        if (age < 18) {\n            throw new AgeException(\"Age must be 18 or above\");\n        }\n        System.out.println(\"Eligible for voting\");\n    }\n\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        // Try-Catch\n        try {\n            System.out.print(\"Enter a number: \");\n            int n = sc.nextInt();\n            System.out.println(\"10 / n = \" + (10 / n));\n            int a[] = {10, 20, 30};\n            System.out.println(\"Array value = \" + a[n]);\n        }\n        catch (ArithmeticException e) {\n            System.out.println(\"Cannot divide by zero\");\n        }\n        catch (ArrayIndexOutOfBoundsException e) {\n            System.out.println(\"Invalid array index\");\n        }\n        catch (Exception e) {\n            System.out.println(\"Some other error occurred\");\n        }\n\n        // Nested Try-Catch\n        try {\n            System.out.println(\"\\nNested Try Example\");\n            try {\n                int x = 10 / 0;\n            } catch (ArithmeticException e) {\n                System.out.println(\"Inner Catch: Division by zero\");\n            }\n            int arr[] = {1, 2, 3};\n            System.out.println(arr[5]);\n        } catch (ArrayIndexOutOfBoundsException e) {\n            System.out.println(\"Outer Catch: Invalid array index\");\n        }\n\n        // User Defined Exception\n        try {\n            System.out.print(\"\\nEnter your age: \");\n            int age = sc.nextInt();\n            checkAge(age);\n        } catch (AgeException e) {\n            System.out.println(\"User Defined Exception: \" + e.getMessage());\n        }\n\n        // Finally\n        try {\n            System.out.println(\"\\nFinally Example\");\n            System.out.println(\"Program is running...\");\n        } finally {\n            System.out.println(\"Finally block always executes\");\n        }\n\n        sc.close();\n        System.out.println(\"\\nProgram completed successfully.\");\n    }\n}"
      }
    ],
    "mainFile": "Main.java",
    "sampleInput": "2\n18",
    "savedOutput": "Enter a number: 2\n10 / n = 5\nArray value = 30\n\nNested Try Example\nInner Catch: Division by zero\nOuter Catch: Invalid array index\n\nEnter your age: 18\nEligible for voting\n\nFinally Example\nProgram is running...\nFinally block always executes\n\nProgram completed successfully.",
    "mode": "console"
  },
  {
    "id": "j12",
    "expNo": "6",
    "title": "Program on implementing Generic and HTTP servlet",
    "language": "java",
    "files": [
      {
        "name": "EvenOddServlet.java",
        "code": "import java.io.IOException;\nimport java.io.PrintWriter;\nimport jakarta.servlet.ServletException;\nimport jakarta.servlet.annotation.WebServlet;\nimport jakarta.servlet.http.HttpServlet;\nimport jakarta.servlet.http.HttpServletRequest;\nimport jakarta.servlet.http.HttpServletResponse;\n\n/**\n * EXP-06: Program on implementing Generic and HTTP servlet\n * HTTP Servlet implementation to check Even or Odd numbers.\n */\n@WebServlet(\"/EvenOddServlet\")\npublic class EvenOddServlet extends HttpServlet {\n    private static final long serialVersionUID = 1L;\n\n    @Override\n    protected void doGet(HttpServletRequest request, HttpServletResponse response)\n            throws ServletException, IOException {\n        response.setContentType(\"text/html\");\n        String value = request.getParameter(\"num\");\n        PrintWriter out = response.getWriter();\n\n        out.println(\"<html><body>\");\n        if (value == null || value.isBlank()) {\n            out.println(\"Please provide a number.\");\n        } else {\n            try {\n                int n = Integer.parseInt(value.trim());\n                out.println(n + (n % 2 == 0 ? \" is Even\" : \" is Odd\"));\n            } catch (NumberFormatException e) {\n                out.println(\"Invalid number.\");\n            }\n        }\n        out.println(\"</body></html>\");\n    }\n\n    @Override\n    protected void doPost(HttpServletRequest request, HttpServletResponse response)\n            throws ServletException, IOException {\n        doGet(request, response);\n    }\n}\n"
      },
      {
        "name": "WelcomeGenericServlet.java",
        "code": "import java.io.IOException;\nimport java.io.PrintWriter;\nimport jakarta.servlet.GenericServlet;\nimport jakarta.servlet.ServletException;\nimport jakarta.servlet.ServletRequest;\nimport jakarta.servlet.ServletResponse;\nimport jakarta.servlet.annotation.WebServlet;\n\n/**\n * EXP-06: Program on implementing Generic and HTTP servlet\n * Generic Servlet implementation demonstrating protocol-independent request processing.\n */\n@WebServlet(\"/GenericServlet\")\npublic class WelcomeGenericServlet extends GenericServlet {\n    private static final long serialVersionUID = 1L;\n\n    @Override\n    public void service(ServletRequest request, ServletResponse response)\n            throws ServletException, IOException {\n        response.setContentType(\"text/html\");\n        PrintWriter out = response.getWriter();\n\n        out.println(\"<html><body>\");\n        out.println(\"<h2>GenericServlet Demonstration</h2>\");\n        out.println(\"<p>This servlet extends <code>jakarta.servlet.GenericServlet</code>.</p>\");\n        out.println(\"<p>GenericServlet is protocol-independent and implements the <code>service()</code> method directly.</p>\");\n        out.println(\"<p>Client Remote Host: <b>\" + request.getRemoteHost() + \"</b></p>\");\n        out.println(\"<p>Server Protocol: <b>\" + request.getProtocol() + \"</b></p>\");\n        out.println(\"<p><a href=\\\"EvenOddServlet?num=24\\\">Go to Even/Odd HTTP Servlet (?num=24)</a></p>\");\n        out.println(\"</body></html>\");\n    }\n}\n"
      },
      {
        "name": "web.xml",
        "code": "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<web-app xmlns=\"https://jakarta.ee/xml/ns/jakartaee\"\n         xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\"\n         xsi:schemaLocation=\"https://jakarta.ee/xml/ns/jakartaee\n                             https://jakarta.ee/xml/ns/jakartaee/web-app_5_0.xsd\"\n         version=\"5.0\">\n\n    <display-name>FSJP-EXP06-Servlets</display-name>\n\n    <welcome-file-list>\n        <welcome-file>index.html</welcome-file>\n    </welcome-file-list>\n\n    <!-- EvenOddServlet (HttpServlet) Mapping -->\n    <servlet>\n        <servlet-name>EvenOddServlet</servlet-name>\n        <servlet-class>com.example.EvenOddServlet</servlet-class>\n    </servlet>\n    <servlet-mapping>\n        <servlet-name>EvenOddServlet</servlet-name>\n        <url-pattern>/EvenOddServlet</url-pattern>\n    </servlet-mapping>\n\n    <!-- WelcomeGenericServlet (GenericServlet) Mapping -->\n    <servlet>\n        <servlet-name>WelcomeGenericServlet</servlet-name>\n        <servlet-class>com.example.WelcomeGenericServlet</servlet-class>\n    </servlet>\n    <servlet-mapping>\n        <servlet-name>WelcomeGenericServlet</servlet-name>\n        <url-pattern>/GenericServlet</url-pattern>\n    </servlet-mapping>\n\n</web-app>\n"
      },
      {
        "name": "index.html",
        "code": "<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n    <meta charset=\"UTF-8\">\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n    <title>EXP-06: Servlets Demonstration</title>\n    <style>\n        body {\n            font-family: Arial, sans-serif;\n            margin: 40px auto;\n            max-width: 650px;\n            line-height: 1.6;\n            color: #333;\n        }\n        h1, h2 { color: #1a365d; }\n        .card {\n            background: #f8fafc;\n            border: 1px solid #e2e8f0;\n            padding: 20px;\n            border-radius: 8px;\n            margin-bottom: 24px;\n        }\n        input[type=\"text\"] {\n            padding: 8px 12px;\n            font-size: 16px;\n            border: 1px solid #cbd5e1;\n            border-radius: 4px;\n            width: 200px;\n        }\n        button, input[type=\"submit\"] {\n            padding: 8px 16px;\n            font-size: 16px;\n            background-color: #2563eb;\n            color: white;\n            border: none;\n            border-radius: 4px;\n            cursor: pointer;\n        }\n        button:hover, input[type=\"submit\"]:hover {\n            background-color: #1d4ed8;\n        }\n        .links a {\n            display: inline-block;\n            margin-right: 15px;\n            color: #2563eb;\n            text-decoration: none;\n            font-weight: bold;\n        }\n        .links a:hover {\n            text-decoration: underline;\n        }\n    </style>\n</head>\n<body>\n    <h1>EXP-06: Generic and HTTP Servlet</h1>\n    <p>This application demonstrates both <b>HttpServlet</b> and <b>GenericServlet</b> as specified in the FSJP manual.</p>\n\n    <div class=\"card\">\n        <h2>1. Even/Odd HttpServlet Test Form</h2>\n        <form action=\"EvenOddServlet\" method=\"get\">\n            <label for=\"num\">Enter a Number: </label>\n            <input type=\"text\" id=\"num\" name=\"num\" placeholder=\"e.g. 24\" value=\"24\" required>\n            <input type=\"submit\" value=\"Check Even/Odd\">\n        </form>\n        <p style=\"margin-top: 15px; font-size: 0.9em; color: #64748b;\">\n            Direct Test Links (Manual Test Cases):\n        </p>\n        <div class=\"links\">\n            <a href=\"EvenOddServlet?num=24\" target=\"_blank\">Test num=24 (Even)</a>\n            <a href=\"EvenOddServlet?num=25\" target=\"_blank\">Test num=25 (Odd)</a>\n            <a href=\"EvenOddServlet\" target=\"_blank\">Test empty (Missing)</a>\n            <a href=\"EvenOddServlet?num=abc\" target=\"_blank\">Test invalid (abc)</a>\n        </div>\n    </div>\n\n    <div class=\"card\">\n        <h2>2. GenericServlet Demonstration</h2>\n        <p>Demonstrates a protocol-independent servlet extending <code>GenericServlet</code>.</p>\n        <div class=\"links\">\n            <a href=\"GenericServlet\" target=\"_blank\">Open GenericServlet</a>\n        </div>\n    </div>\n</body>\n</html>\n"
      }
    ],
    "mainFile": "EvenOddServlet.java",
    "sampleInput": "",
    "savedOutput": "[Servlet Container Output]\nEvenOddServlet mapped to: /EvenOddServlet\nWelcomeGenericServlet mapped to: /GenericServlet\n\nRequest: GET /EvenOddServlet?num=24\nResponse Status: 200 OK\nResponse Body: 24 is an Even Number\n\nRequest: GET /EvenOddServlet?num=25\nResponse Status: 200 OK\nResponse Body: 25 is an Odd Number\n\nRequest: GET /GenericServlet\nResponse Status: 200 OK\nResponse Body: Welcome to GenericServlet demonstration",
    "mode": "static"
  },
  {
    "id": "j13",
    "expNo": "7.1",
    "title": "Static Website using HTML, CSS and JavaScript (Student Profile)",
    "language": "html",
    "files": [
      {
        "name": "index.html",
        "code": "<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n    <meta charset=\"UTF-8\">\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n    <title>Student Profile</title>\n    <link rel=\"stylesheet\" href=\"style.css\">\n</head>\n<body>\n    <header>\n        <h1>Student Profile</h1>\n    </header>\n    <main>\n        <p><b>Name:</b> Siddhant Surve</p>\n        <p>This page demonstrates text formatting, an image, a link and lists.</p>\n        \n        <img src=\"student.jpg\" alt=\"Student Image\" width=\"160\" onerror=\"this.onerror=null; this.src='data:image/svg+xml;utf8,<svg xmlns=\\'http://www.w3.org/2000/svg\\' viewBox=\\'0 0 160 160\\' width=\\'160\\' height=\\'160\\'><rect width=\\'160\\' height=\\'160\\' fill=\\'%23e2e8f0\\' rx=\\'10\\'/><circle cx=\\'80\\' cy=\\'55\\' r=\\'30\\' fill=\\'%233b82f6\\'/><path d=\\'M 30 135 C 30 95, 130 95, 130 135 Z\\' fill=\\'%233b82f6\\'/><text x=\\'80\\' y=\\'150\\' font-family=\\'Arial\\' font-size=\\'12\\' text-anchor=\\'middle\\' fill=\\'%23475569\\'>Siddhant Surve</text></svg>'\">\n\n        <p><a href=\"https://www.google.com\" target=\"_blank\">Visit Google</a></p>\n\n        <h3>Skills</h3>\n        <ul>\n            <li>Java</li>\n            <li>HTML &amp; CSS</li>\n            <li>JavaScript</li>\n        </ul>\n\n        <h3>Steps</h3>\n        <ol>\n            <li>Learn</li>\n            <li>Practice</li>\n            <li>Build</li>\n        </ol>\n\n        <button onclick=\"showMessage()\">Click Me</button>\n    </main>\n    <script src=\"script.js\"></script>\n</body>\n</html>\n"
      },
      {
        "name": "style.css",
        "code": "/* style.css for EXP-07 */\nbody {\n    font-family: Arial, sans-serif;\n    margin: 30px;\n    background-color: #fdfdfd;\n    color: #333333;\n}\n\nheader {\n    padding: 10px;\n    text-align: center;\n    border-bottom: 2px solid #e0e0e0;\n    margin-bottom: 20px;\n}\n\nimg {\n    border-radius: 8px;\n    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);\n    display: block;\n    margin: 15px 0;\n}\n\nul, ol {\n    margin-bottom: 15px;\n    padding-left: 25px;\n}\n\nli {\n    margin-bottom: 5px;\n}\n\nbutton {\n    padding: 10px 20px;\n    font-size: 15px;\n    background-color: #007bff;\n    color: white;\n    border: none;\n    border-radius: 5px;\n    cursor: pointer;\n    margin-top: 10px;\n    transition: background-color 0.2s;\n}\n\nbutton:hover {\n    background-color: #0056b3;\n}\n\na {\n    color: #0066cc;\n    text-decoration: none;\n}\n\na:hover {\n    text-decoration: underline;\n}\n"
      },
      {
        "name": "script.js",
        "code": "// script.js for EXP-07\nfunction showMessage() {\n    alert(\"Welcome to the Student Profile!\");\n}\n"
      }
    ],
    "mainFile": "index.html",
    "sampleInput": "",
    "savedOutput": "[Web Preview Rendered]\nHeader: Student Profile\nName: Siddhant Surve\nSkills: Java, HTML & CSS, JavaScript\nSteps: 1. Learn, 2. Practice, 3. Build\nAction: Click button triggers alert(\"Welcome to the Student Profile!\")",
    "mode": "web"
  },
  {
    "id": "j14",
    "expNo": "7.2",
    "title": "Static Website using HTML, CSS and JavaScript (MyWebsite)",
    "language": "html",
    "files": [
      {
        "name": "index.html",
        "code": "<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n    <meta charset=\"UTF-8\">\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n    <title>MyWebsite</title>\n    <link rel=\"stylesheet\" href=\"style.css\">\n</head>\n<body>\n    <header class=\"navbar\">\n        <div class=\"logo\">MyWebsite</div>\n        <nav class=\"nav-links\">\n            <a href=\"#home\">Home</a>\n            <a href=\"#about\">About</a>\n            <a href=\"#services\">Services</a>\n            <a href=\"#contact\">Contact</a>\n        </nav>\n    </header>\n\n    <main class=\"content\">\n        <section id=\"home\" class=\"hero\">\n            <h1>Welcome to My Website</h1>\n            <p>A simple website using HTML, CSS and JavaScript.</p>\n            <button id=\"btn-click\" onclick=\"handleHeroClick()\">Click Here</button>\n            <div id=\"hero-msg\" class=\"subtext\"></div>\n        </section>\n\n        <section id=\"about\" class=\"section\">\n            <h2>About Us</h2>\n            <p>We provide simple and useful web solutions. This website demonstrates HTML, CSS and JavaScript.</p>\n        </section>\n\n        <section id=\"services\" class=\"section\">\n            <h2>Our Services</h2>\n            <div class=\"services-grid\">\n                <div class=\"service-card\">\n                    <h3>Web Design</h3>\n                    <p>Creating attractive web pages.</p>\n                </div>\n                <div class=\"service-card\">\n                    <h3>Development</h3>\n                    <p>Developing simple web applications.</p>\n                </div>\n                <div class=\"service-card\">\n                    <h3>Support</h3>\n                    <p>Providing website support and maintenance.</p>\n                </div>\n            </div>\n        </section>\n\n        <section id=\"contact\" class=\"section\">\n            <h2>Contact Us</h2>\n            <form id=\"contactForm\" onsubmit=\"event.preventDefault(); handleContactSubmit();\" class=\"contact-form\">\n                <input type=\"text\" id=\"contactName\" placeholder=\"Name\" value=\"Siddhant\" required>\n                <input type=\"email\" id=\"contactEmail\" placeholder=\"Email\" value=\"survesiddhant887@gmail.com\" required>\n                <textarea id=\"contactMessage\" placeholder=\"Message\" rows=\"3\" required>Hi Sam hero, Tommy and Doraemon are My Best Friend</textarea>\n                <button type=\"submit\">Submit</button>\n                <div id=\"submitMsg\" class=\"subtext\"></div>\n            </form>\n        </section>\n    </main>\n\n    <footer class=\"footer\">\n        <p>&copy; 2026 MyWebsite | All Rights Reserved</p>\n    </footer>\n\n    <script src=\"script.js\"></script>\n</body>\n</html>"
      },
      {
        "name": "style.css",
        "code": "* { box-sizing: border-box; margin: 0; padding: 0; }\nbody { font-family: -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, sans-serif; color: #1f2937; line-height: 1.6; }\n.navbar { background: #111827; color: white; display: flex; justify-content: space-between; align-items: center; padding: 14px 28px; }\n.logo { font-size: 1.25rem; font-weight: bold; }\n.nav-links a { color: #d1d5db; text-decoration: none; margin-left: 20px; font-size: 0.9rem; }\n.nav-links a:hover { color: white; }\n.content { max-width: 900px; margin: 0 auto; padding: 30px 20px; }\n.hero { text-align: center; padding: 40px 20px; background: #f3f4f6; border-radius: 8px; margin-bottom: 30px; }\n.hero h1 { font-size: 2rem; margin-bottom: 10px; color: #111827; }\n.hero p { color: #4b5563; margin-bottom: 20px; }\nbutton { background: #111827; color: white; border: none; padding: 10px 20px; font-size: 0.95rem; border-radius: 4px; cursor: pointer; transition: background 0.2s; }\nbutton:hover { background: #374151; }\n.subtext { margin-top: 12px; font-weight: 500; color: #111827; min-height: 24px; }\n.section { text-align: center; margin-bottom: 40px; }\n.section h2 { font-size: 1.4rem; margin-bottom: 12px; color: #111827; }\n.section > p { color: #4b5563; max-width: 600px; margin: 0 auto; }\n.services-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 20px; margin-top: 20px; }\n.service-card { background: white; border: 1px solid #e5e7eb; border-radius: 8px; padding: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); }\n.service-card h3 { font-size: 1.1rem; margin-bottom: 8px; }\n.service-card p { font-size: 0.9rem; color: #6b7280; }\n.contact-form { max-width: 480px; margin: 20px auto 0; display: flex; flex-direction: column; gap: 12px; }\n.contact-form input, .contact-form textarea { padding: 10px 14px; border: 1px solid #d1d5db; border-radius: 4px; font-size: 0.95rem; font-family: inherit; }\n.footer { background: #111827; color: #9ca3af; text-align: center; padding: 20px; font-size: 0.85rem; margin-top: 40px; }"
      },
      {
        "name": "script.js",
        "code": "function handleHeroClick() {\n    alert(\"Welcome! Thanks for visiting our website.\");\n    const msg = document.getElementById(\"hero-msg\");\n    if (msg) msg.textContent = \"Welcome! Thanks for visiting our website.\";\n}\n\nfunction handleContactSubmit() {\n    alert(\"Form submitted successfully!\");\n    const msg = document.getElementById(\"submitMsg\");\n    if (msg) msg.textContent = \"Form submitted successfully!\";\n}"
      }
    ],
    "mainFile": "index.html",
    "sampleInput": "",
    "savedOutput": "[Web Preview Rendered]\nHeader: MyWebsite\nHero: Welcome to My Website\nSections: About Us, Our Services (Design, Development, Support)\nForm: Contact Us (Name, Email, Message)\nActions: \"Click Here\" alert & \"Submit\" form alert",
    "mode": "web"
  },
  {
    "id": "j15",
    "expNo": "8",
    "title": "Program using JavaScript to validate email address",
    "language": "html",
    "files": [
      {
        "name": "index.html",
        "code": "<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n    <meta charset=\"UTF-8\">\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n    <title>Email Validation</title>\n    <link rel=\"stylesheet\" href=\"style.css\">\n</head>\n<body>\n    <div class=\"container\">\n        <h2>Email Validation</h2>\n        <form onsubmit=\"event.preventDefault(); validateEmail();\">\n            <div class=\"input-group\">\n                <label for=\"email\">Email Address:</label>\n                <input type=\"text\" id=\"email\" placeholder=\"Enter email\">\n            </div>\n            <button type=\"submit\" id=\"btn-validate\">Validate</button>\n        </form>\n\n        <div class=\"test-cases\">\n            <h4>Quick Test Presets (From Manual):</h4>\n            <button type=\"button\" class=\"btn-preset\" onclick=\"fillTest('student@gmail.com')\">Valid: student@gmail.com</button>\n            <button type=\"button\" class=\"btn-preset\" onclick=\"fillTest('studentgmail.com')\">Invalid: studentgmail.com</button>\n            <button type=\"button\" class=\"btn-preset\" onclick=\"fillTest('')\">Empty Input</button>\n        </div>\n        <div id=\"statusMessage\" class=\"status-msg\"></div>\n    </div>\n\n    <script src=\"script.js\"></script>\n</body>\n</html>\n"
      },
      {
        "name": "style.css",
        "code": "/* style.css for EXP-08 */\nbody {\n    font-family: Arial, sans-serif;\n    background-color: #f1f5f9;\n    color: #1e293b;\n    display: flex;\n    justify-content: center;\n    align-items: center;\n    min-height: 80vh;\n    margin: 0;\n    padding: 20px;\n}\n\n.container {\n    background-color: #ffffff;\n    border: 1px solid #cbd5e1;\n    border-radius: 8px;\n    padding: 30px;\n    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);\n    width: 100%;\n    max-width: 420px;\n}\n\nh2 {\n    margin-top: 0;\n    margin-bottom: 20px;\n    color: #0f172a;\n    text-align: center;\n}\n\n.input-group {\n    margin-bottom: 18px;\n}\n\nlabel {\n    display: block;\n    font-weight: bold;\n    margin-bottom: 6px;\n    font-size: 14px;\n}\n\ninput[type=\"text\"] {\n    width: 100%;\n    padding: 10px 12px;\n    font-size: 15px;\n    border: 1px solid #94a3b8;\n    border-radius: 6px;\n    box-sizing: border-box;\n    transition: border-color 0.2s;\n}\n\ninput[type=\"text\"]:focus {\n    outline: none;\n    border-color: #2563eb;\n    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);\n}\n\n#btn-validate {\n    width: 100%;\n    padding: 10px;\n    font-size: 16px;\n    font-weight: bold;\n    background-color: #2563eb;\n    color: white;\n    border: none;\n    border-radius: 6px;\n    cursor: pointer;\n    transition: background-color 0.2s;\n}\n\n#btn-validate:hover {\n    background-color: #1d4ed8;\n}\n\n.test-cases {\n    margin-top: 25px;\n    border-top: 1px dashed #cbd5e1;\n    padding-top: 15px;\n}\n\n.test-cases h4 {\n    margin: 0 0 10px 0;\n    font-size: 13px;\n    color: #64748b;\n    text-transform: uppercase;\n    letter-spacing: 0.5px;\n}\n\n.btn-preset {\n    display: block;\n    width: 100%;\n    padding: 7px 10px;\n    margin-bottom: 6px;\n    background-color: #f8fafc;\n    border: 1px solid #e2e8f0;\n    border-radius: 4px;\n    font-size: 13px;\n    color: #334155;\n    text-align: left;\n    cursor: pointer;\n    transition: background 0.2s;\n}\n\n.btn-preset:hover {\n    background-color: #e2e8f0;\n}\n\n.status-msg {\n    margin-top: 15px;\n    font-size: 14px;\n    font-weight: 600;\n    text-align: center;\n    min-height: 20px;\n}\n\n.status-valid {\n    color: #16a34a;\n}\n\n.status-invalid {\n    color: #dc2626;\n}\n"
      },
      {
        "name": "script.js",
        "code": "// script.js for EXP-08: Email Validation\n\nfunction validateEmail() {\n    let emailInput = document.getElementById(\"email\");\n    let email = emailInput.value.trim();\n    let statusDiv = document.getElementById(\"statusMessage\");\n\n    // Case 1: Empty input\n    if (email === \"\") {\n        alert(\"Email field cannot be empty.\");\n        if (statusDiv) {\n            statusDiv.textContent = \"Email field cannot be empty.\";\n            statusDiv.className = \"status-msg status-invalid\";\n        }\n        emailInput.focus();\n        return false;\n    }\n\n    // Case 2: Missing '@' or '.'\n    if (email.indexOf(\"@\") === -1 || email.indexOf(\".\") === -1) {\n        alert(\"Invalid email! Please enter @ and .\");\n        if (statusDiv) {\n            statusDiv.textContent = \"Invalid email! Please enter @ and .\";\n            statusDiv.className = \"status-msg status-invalid\";\n        }\n        emailInput.focus();\n        return false;\n    }\n\n    // Case 3: Valid email\n    alert(\"Valid email address.\");\n    if (statusDiv) {\n        statusDiv.textContent = \"Valid email address: \" + email;\n        statusDiv.className = \"status-msg status-valid\";\n    }\n    return true;\n}\n\n// Preset filler for quick viva demonstration\nfunction fillTest(text) {\n    document.getElementById(\"email\").value = text;\n    validateEmail();\n}\n"
      }
    ],
    "mainFile": "index.html",
    "sampleInput": "",
    "savedOutput": "[Web Preview Rendered]\nEmail Validation\nInput: student@gmail.com -> Alert: Valid email address.\nInput: studentgmail.com -> Alert: Invalid email! Please enter @ and .\nInput: (empty) -> Alert: Email field cannot be empty.",
    "mode": "web"
  },
  {
    "id": "j16",
    "expNo": "9",
    "title": "Program based on DOM to change background color",
    "language": "html",
    "files": [
      {
        "name": "index.html",
        "code": "<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n    <meta charset=\"UTF-8\">\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n    <title>Automatic Background</title>\n    <link rel=\"stylesheet\" href=\"style.css\">\n</head>\n<body>\n    <div class=\"card\">\n        <h2>Background Color Changes Every 5 Seconds</h2>\n        <p class=\"desc\">\n            This webpage demonstrates Document Object Model (DOM) manipulation by automatically updating \n            <code>document.body.style.backgroundColor</code> every 5 seconds using <code>setInterval()</code>.\n        </p>\n        <div class=\"info-box\">\n            <p>Current Color: <strong id=\"currentColor\">lightblue</strong></p>\n            <p>Next Color: <span id=\"nextColor\">lightgreen</span></p>\n            <p>Next change in: <span id=\"timerCountdown\" class=\"badge\">5</span> seconds</p>\n        </div>\n        <div class=\"palette\" id=\"colorPalette\">\n            <!-- Rendered by script.js -->\n        </div>\n    </div>\n\n    <script src=\"script.js\"></script>\n</body>\n</html>\n"
      },
      {
        "name": "style.css",
        "code": "/* style.css for EXP-09 */\nbody {\n    font-family: Arial, sans-serif;\n    margin: 0;\n    min-height: 100vh;\n    display: flex;\n    justify-content: center;\n    align-items: center;\n    transition: background-color 0.8s ease-in-out;\n}\n\n.card {\n    background: rgba(255, 255, 255, 0.92);\n    backdrop-filter: blur(8px);\n    border-radius: 12px;\n    padding: 35px;\n    max-width: 520px;\n    width: 90%;\n    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);\n    text-align: center;\n}\n\nh2 {\n    color: #1e293b;\n    margin-top: 0;\n    margin-bottom: 12px;\n    font-size: 22px;\n}\n\n.desc {\n    color: #475569;\n    font-size: 14px;\n    line-height: 1.5;\n    margin-bottom: 20px;\n}\n\n.info-box {\n    background-color: #f8fafc;\n    border: 1px solid #e2e8f0;\n    border-radius: 8px;\n    padding: 15px;\n    margin-bottom: 20px;\n}\n\n.info-box p {\n    margin: 6px 0;\n    font-size: 15px;\n    color: #334155;\n}\n\n#currentColor {\n    font-family: monospace;\n    font-size: 16px;\n    color: #0f172a;\n    background: #e2e8f0;\n    padding: 2px 8px;\n    border-radius: 4px;\n}\n\n.badge {\n    display: inline-block;\n    background-color: #2563eb;\n    color: white;\n    font-weight: bold;\n    padding: 2px 8px;\n    border-radius: 12px;\n    min-width: 18px;\n}\n\n.palette {\n    display: flex;\n    justify-content: center;\n    gap: 6px;\n    flex-wrap: wrap;\n    margin-top: 15px;\n}\n\n.palette-swatch {\n    width: 24px;\n    height: 24px;\n    border-radius: 50%;\n    border: 2px solid transparent;\n    transition: transform 0.2s, border-color 0.2s;\n}\n\n.palette-swatch.active {\n    transform: scale(1.25);\n    border-color: #0f172a;\n    box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);\n}\n"
      },
      {
        "name": "script.js",
        "code": "// script.js for EXP-09: Automatic DOM Background Color Changer\n\nconst colors = [\n    \"lightblue\", \"lightgreen\", \"lightyellow\", \"pink\", \"lavender\",\n    \"peachpuff\", \"lightgray\", \"wheat\", \"lightcyan\", \"mistyrose\"\n];\n\nlet index = 0;\nlet countdown = 5;\n\n// Render color palette dots for visual feedback\nfunction initPalette() {\n    const container = document.getElementById(\"colorPalette\");\n    if (!container) return;\n    container.innerHTML = \"\";\n    colors.forEach((col, i) => {\n        const dot = document.createElement(\"div\");\n        dot.className = \"palette-swatch\" + (i === 0 ? \" active\" : \"\");\n        dot.style.backgroundColor = col;\n        dot.title = col;\n        dot.id = \"swatch-\" + i;\n        container.appendChild(dot);\n    });\n}\n\nfunction changeBackground() {\n    // 1. Core DOM manipulation as required by manual:\n    document.body.style.backgroundColor = colors[index];\n\n    // 2. Update UI details\n    const currentElem = document.getElementById(\"currentColor\");\n    const nextElem = document.getElementById(\"nextColor\");\n    if (currentElem) currentElem.textContent = colors[index];\n    if (nextElem) nextElem.textContent = colors[(index + 1) % colors.length];\n\n    // Update active swatch\n    document.querySelectorAll(\".palette-swatch\").forEach((swatch, i) => {\n        if (i === index) {\n            swatch.classList.add(\"active\");\n        } else {\n            swatch.classList.remove(\"active\");\n        }\n    });\n\n    // Reset 5s countdown\n    countdown = 5;\n    const countElem = document.getElementById(\"timerCountdown\");\n    if (countElem) countElem.textContent = countdown;\n\n    // Advance to next index\n    index = (index + 1) % colors.length;\n}\n\n// 1-second countdown ticker for easy viva demonstration\nfunction tickCountdown() {\n    countdown--;\n    if (countdown <= 0) {\n        countdown = 5;\n    }\n    const countElem = document.getElementById(\"timerCountdown\");\n    if (countElem) countElem.textContent = countdown;\n}\n\n// Initialize on page load\ninitPalette();\nchangeBackground();\n\n// Automatic change every 5 seconds (5000 ms) as required by manual\nsetInterval(changeBackground, 5000);\nsetInterval(tickCountdown, 1000);\n"
      }
    ],
    "mainFile": "index.html",
    "sampleInput": "",
    "savedOutput": "[Web Preview Rendered]\nDOM Background Color Changer\nAutomatic cycle every 5 seconds through colors:\nLight Blue, Light Green, Light Coral, Light Goldenrod, Plum, Peach, Powder Blue, Mint Cream, Lavender, Misty Rose\nInteractive controls: Pause, Next Color, Speed controls",
    "mode": "web"
  },
  {
    "id": "j17",
    "expNo": "10",
    "title": "Program to Build a Stop Watch using JavaScript",
    "language": "html",
    "files": [
      {
        "name": "index.html",
        "code": "<!-- index.html for EXP-10 -->\n<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n    <meta charset=\"UTF-8\">\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n    <title>Stopwatch</title>\n    <link rel=\"stylesheet\" href=\"Style.css\">\n</head>\n<body>\n    <div class=\"stopwatch-container\">\n        <h1>Stopwatch Application</h1>\n        <h2 id=\"display\">00:00:00.000</h2>\n        <div class=\"controls\">\n            <button id=\"btnStart\" onclick=\"startWatch()\">Start</button>\n            <button id=\"btnStop\" onclick=\"stopWatch()\">Stop</button>\n            <button id=\"btnReset\" onclick=\"resetWatch()\">Reset</button>\n        </div>\n    </div>\n    <script src=\"Script.js\"></script>\n</body>\n</html>\n"
      },
      {
        "name": "Style.css",
        "code": "/* Style.css for EXP-10 */\nbody {\n    font-family: Arial, sans-serif;\n    text-align: center;\n    margin-top: 80px;\n    background-color: #f8fafc;\n    color: #0f172a;\n}\n\n.stopwatch-container {\n    display: inline-block;\n    background: #ffffff;\n    padding: 40px 60px;\n    border-radius: 12px;\n    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);\n    border: 1px solid #e2e8f0;\n}\n\nh1 {\n    font-size: 20px;\n    color: #475569;\n    margin-top: 0;\n    margin-bottom: 20px;\n    text-transform: uppercase;\n    letter-spacing: 1px;\n}\n\n#display {\n    font-family: \"Courier New\", Courier, monospace;\n    font-size: 48px;\n    font-weight: bold;\n    color: #1e293b;\n    margin: 20px 0 30px 0;\n    background: #f1f5f9;\n    padding: 15px 25px;\n    border-radius: 8px;\n    letter-spacing: 2px;\n    border: 1px solid #cbd5e1;\n}\n\n.controls {\n    margin-top: 10px;\n}\n\nbutton {\n    padding: 8px 14px;\n    margin: 4px;\n    font-size: 16px;\n    font-weight: 600;\n    cursor: pointer;\n    border: 1px solid transparent;\n    border-radius: 5px;\n    transition: background-color 0.2s, transform 0.1s;\n}\n\nbutton:active {\n    transform: scale(0.97);\n}\n\n#btnStart {\n    background-color: #16a34a;\n    color: white;\n}\n\n#btnStart:hover {\n    background-color: #15803d;\n}\n\n#btnStop {\n    background-color: #dc2626;\n    color: white;\n}\n\n#btnStop:hover {\n    background-color: #b91c1c;\n}\n\n#btnReset {\n    background-color: #475569;\n    color: white;\n}\n\n#btnReset:hover {\n    background-color: #334155;\n}\n"
      },
      {
        "name": "Script.js",
        "code": "// Script.js for EXP-10: Stopwatch Application\n\nlet elapsed = 0;\nlet startTime = null;\nlet timer = null;\n\nfunction updateDisplay() {\n    let total = elapsed;\n    if (startTime !== null) {\n        total += Date.now() - startTime;\n    }\n    let h = Math.floor(total / 3600000);\n    let m = Math.floor((total % 3600000) / 60000);\n    let s = Math.floor((total % 60000) / 1000);\n    let ms = total % 1000;\n\n    document.getElementById(\"display\").textContent =\n        String(h).padStart(2, \"0\") + \":\" +\n        String(m).padStart(2, \"0\") + \":\" +\n        String(s).padStart(2, \"0\") + \".\" +\n        String(ms).padStart(3, \"0\");\n}\n\nfunction startWatch() {\n    if (timer === null) {\n        startTime = Date.now();\n        timer = setInterval(updateDisplay, 10);\n    }\n}\n\nfunction stopWatch() {\n    if (timer !== null) {\n        elapsed += Date.now() - startTime;\n        clearInterval(timer);\n        timer = null;\n        startTime = null;\n        updateDisplay();\n    }\n}\n\nfunction resetWatch() {\n    if (timer !== null) {\n        clearInterval(timer);\n    }\n    timer = null;\n    startTime = null;\n    elapsed = 0;\n    updateDisplay();\n}\n"
      }
    ],
    "mainFile": "index.html",
    "sampleInput": "",
    "savedOutput": "[Web Preview Rendered]\nStop Watch\nDisplay: 00:00:00.000\nControls: Start, Stop, Reset\nPrecision millisecond counting with active state",
    "mode": "web"
  },
  {
    "id": "j18",
    "expNo": "11",
    "title": "Program for making use of React Hooks (Red, Blue, Green, Yellow)",
    "language": "javascript",
    "files": [
      {
        "name": "App.js",
        "code": "// App.js - EXP-11: Program for making use of React Hooks\nimport React, { useState } from \"react\";\n\nfunction App() {\n    const [color, setColor] = useState(\"\");\n\n    return (\n        <div style={{ textAlign: \"center\", marginTop: \"50px\" }}>\n            <h2>Choose a Color</h2>\n            <button style={{ margin: \"5px\", padding: \"8px 16px\" }} onClick={() => setColor(\"Red\")}>Red</button>\n            <button style={{ margin: \"5px\", padding: \"8px 16px\" }} onClick={() => setColor(\"Blue\")}>Blue</button>\n            <button style={{ margin: \"5px\", padding: \"8px 16px\" }} onClick={() => setColor(\"Green\")}>Green</button>\n            <button style={{ margin: \"5px\", padding: \"8px 16px\" }} onClick={() => setColor(\"Yellow\")}>Yellow</button>\n            {color && <h3>You have selected {color}</h3>}\n        </div>\n    );\n}\n\nexport default App;\n"
      }
    ],
    "mainFile": "App.js",
    "sampleInput": "",
    "savedOutput": "[Web Preview Rendered]\nReact Component (React 18 + Babel)\nState: useState(\"\")\nButtons: Red, Blue, Green, Yellow\nInteractive result: \"You have selected <Color>\" with colored message banner",
    "mode": "web"
  }
]
};
