const questions = [
  {
    id: 1,
    difficulty: "easy",
    question: "Write a program that prints 'Hello, World!' to the console.",
    input: "No input required",
    output: "Hello, World!",
    code: {
      cpp: `#include <iostream>
using namespace std;
int main() {
  cout << "Hello, World!" << endl;
  return 0;
}`,
      java: `public class Main {
  public static void main(String[] args) {
    System.out.println("Hello, World!");
  }
}`
    },
    hiddenTestCases: [
      { input: "", output: "Hello, World!", points: 5 }
    ],
    isSubmitted : false,
  },
  {
    id: 2,
    difficulty: "medium",
    question: "Write a function to check if a number is prime.",
    input: "5",
    output: "true",
    code: {
      cpp: `#include <iostream>
using namespace std;
bool isPrime(int n) {
  if (n < 2) return false;
  for (int i = 2; i * i <= n; i++)
    if (n % i == 0) return false;
  return true;
}
int main() {
  int num;
  cin >> num;
  cout << (isPrime(num) ? "true" : "false") << endl;
  return 0;
}`,
      java: `import java.util.Scanner;
public class Main {
  static boolean isPrime(int n) {
    if (n < 2) return false;
    for (int i = 2; i * i <= n; i++)
      if (n % i == 0) return false;
    return true;
  }
  public static void main(String[] args) {
    Scanner sc = new Scanner(System.in);
    int num = sc.nextInt();
    System.out.println(isPrime(num));
  }
}`
    },
    hiddenTestCases: [
      { input: "2", output: "true", points: 5 },
      { input: "10", output: "false", points: 5 },
      { input: "13", output: "true", points: 5 }
    ],
    isSubmitted : false,
  },
  {
    id: 3,
    difficulty: "medium",
    question: "Implement a Fibonacci sequence generator.",
    input: "6",
    output: "0 1 1 2 3 5",
    code: {
      cpp: `#include <iostream>
using namespace std;
void fibonacci(int n) {
  int a = 0, b = 1, c;
  for (int i = 0; i < n; i++) {
    cout << a << " ";
    c = a + b;
    a = b;
    b = c;
  }
}
int main() {
  int n;
  cin >> n;
  fibonacci(n);
  return 0;
}`,
      java: `import java.util.Scanner;
public class Main {
  static void fibonacci(int n) {
    int a = 0, b = 1, c;
    for (int i = 0; i < n; i++) {
      System.out.print(a + " ");
      c = a + b;
      a = b;
      b = c;
    }
  }
  public static void main(String[] args) {
    Scanner sc = new Scanner(System.in);
    int n = sc.nextInt();
    fibonacci(n);
  }
}`
    },
    hiddenTestCases: [
      { input: "1", output: "0", points: 5 },
      { input: "3", output: "0 1 1", points: 5 },
      { input: "7", output: "0 1 1 2 3 5 8", points: 5 }
    ],
    isSubmitted : false,
  },
  {
    id: 4,
    difficulty: "hard",
    question: "Find the longest common subsequence (LCS) of two strings.",
    input: '"abcde" "ace"',
    output: '"ace"',
    code: {
      cpp: `#include <iostream>
#include <vector>
using namespace std;
string lcs(string s1, string s2) {
  int m = s1.size(), n = s2.size();
  vector<vector<int>> dp(m + 1, vector<int>(n + 1, 0));
  for (int i = 1; i <= m; i++) {
    for (int j = 1; j <= n; j++) {
      if (s1[i - 1] == s2[j - 1])
        dp[i][j] = dp[i - 1][j - 1] + 1;
      else
        dp[i][j] = max(dp[i - 1][j], dp[i][j - 1]);
    }
  }
  string res = "";
  int i = m, j = n;
  while (i > 0 && j > 0) {
    if (s1[i - 1] == s2[j - 1]) {
      res = s1[i - 1] + res;
      i--; j--;
    } else if (dp[i - 1][j] > dp[i][j - 1])
      i--;
    else
      j--;
  }
  return res;
}
int main() {
  string s1, s2;
  cin >> s1 >> s2;
  cout << lcs(s1, s2) << endl;
  return 0;
}`,
      java: `import java.util.Scanner;
public class Main {
  static String lcs(String s1, String s2) {
    int m = s1.length(), n = s2.length();
    int[][] dp = new int[m + 1][n + 1];
    for (int i = 1; i <= m; i++) {
      for (int j = 1; j <= n; j++) {
        if (s1.charAt(i - 1) == s2.charAt(j - 1))
          dp[i][j] = dp[i - 1][j - 1] + 1;
        else
          dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
    StringBuilder res = new StringBuilder();
    int i = m, j = n;
    while (i > 0 && j > 0) {
      if (s1.charAt(i - 1) == s2.charAt(j - 1)) {
        res.append(s1.charAt(i - 1));
        i--; j--;
      } else if (dp[i - 1][j] > dp[i][j - 1])
        i--;
      else
        j--;
    }
    return res.reverse().toString();
  }
}`
    },
    hiddenTestCases: [
      { input: '"abcdef" "acf"', output: '"acf"', points: 10 },
      { input: '"xyz" "abc"', output: '""', points: 10 }
    ],
    isSubmitted : false,
  }
];

export default questions;
