const questions = [
    {
      "id": 1,
      "difficulty": "hard",
      "question": "Given an N x N chessboard and a knight starting from position (x, y), determine whether the knight can visit every cell exactly once. If possible, return a valid path.",
      "input": "5 0 0",
      "output": "Valid tour exists",
      "code": {
          "cpp": `#include <iostream>
  #include <vector>
  using namespace std;
  
  const int dx[8] = {2, 1, -1, -2, -2, -1, 1, 2};
  const int dy[8] = {1, 2, 2, 1, -1, -2, -2, -1};
  
  bool solveKnightTour(int x, int y, int moveCount, vector<vector<int>>& board, int N) {
      if (moveCount == N * N) return true;
      for (int i = 0; i < 8; i++) {
          int nx = x + dx[i], ny = y + dy[i];
          if (nx >= 0 && ny >= 0 && nx < N && ny < N && board[nx][ny] == -1) {
              board[nx][ny] = moveCount;
              if (solveKnightTour(nx, ny, moveCount + 1, board, N)) return true;
              board[nx][ny] = -1; 
          }
      }
      return false;
  }
  
  void printBoard(vector<vector<int>>& board, int N) {
      for (int i = 0; i < N; i++) {
          for (int j = 0; j < N; j++) {
              cout << board[i][j] << " ";
          }
          cout << endl;
      }
  }
  
  int main() {
      int N, x, y;
      cin >> N >> x >> y;
      vector<vector<int>> board(N, vector<int>(N, -1));
      board[x][y] = 0;
      if (solveKnightTour(x, y, 1, board, N)) {
          cout << "Valid tour exists" << endl;
      } else {
          cout << "No valid tour" << endl;
      }
      return 0;
  }`,
          "java": "import java.util.*;\npublic class Main {\n    static int[] dx = {2, 1, -1, -2, -2, -1, 1, 2};\n    static int[] dy = {1, 2, 2, 1, -1, -2, -2, -1};\n    static boolean solveKnightTour(int x, int y, int moveCount, int[][] board, int N) {\n        if (moveCount == N * N) return true;\n        for (int i = 0; i < 8; i++) {\n            int nx = x + dx[i], ny = y + dy[i];\n            if (nx >= 0 && ny >= 0 && nx < N && ny < N && board[nx][ny] == -1) {\n                board[nx][ny] = moveCount;\n                if (solveKnightTour(nx, ny, moveCount + 1, board, N)) return true;\n                board[nx][ny] = -1;\n            }\n        }\n        return false;\n    }\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int N = sc.nextInt(), x = sc.nextInt(), y = sc.nextInt();\n        int[][] board = new int[N][N];\n        for (int[] row : board) Arrays.fill(row, -1);\n        board[x][y] = 0;\n        if (solveKnightTour(x, y, 1, board, N)) {\n            System.out.println(\"Valid tour exists\");\n        } else {\n            System.out.println(\"No valid tour\");\n        }\n        sc.close();\n    }\n}"
      },
      "hiddenTestCases": [
          { "input": "6 2 2", "output": "Valid tour exists", "points": 4 },
          { "input": "8 0 0", "output": "Valid tour exists", "points": 7 },
          { "input": "4 1 1", "output": "No valid tour", "points": 5 },
          { "input": "5 4 4", "output": "Valid tour exists", "points": 4 }
      ],
      "isSubmitted": false
  }
  ,
    {
      "id": 2,
      "difficulty": "medium",
      "question": "Given two non-empty linked lists representing two non-negative integers, add the two numbers and return the sum as a linked list.",
      "input": "3\n2 4 3\n3\n5 6 4",
      "output": "7 0 8",
      "code": {
          "cpp": `#include <iostream>
  #include <vector>
  
  struct ListNode {
      int val;
      ListNode* next;
      ListNode(int x) : val(x), next(nullptr) {}
  };
  
  class Solution {
  public:
      ListNode* addTwoNumbers(ListNode* l1, ListNode* l2) {
          int carry = 0;
          ListNode* dummy = new ListNode(0);
          ListNode* l = dummy;
          
          while (l1 || l2 || carry) {
              int sum = carry;
              if (l1) {
                  sum += l1->val;
                  l1 = l1->next;
              }
              if (l2) {
                  sum += l2->val;
                  l2 = l2->next;
              }
              
              carry = sum / 10;
              l->next = new ListNode(sum % 10);
              l = l->next;
          }
          
          return dummy->next;
      }
  };
  
  void printList(ListNode* head) {
      while (head) {
          std::cout << head->val << " ";
          head = head->next;
      }
  }
  
  ListNode* createListFromInput() {
      int n, val;
      std::cin >> n;
      
      ListNode* dummy = new ListNode(0);
      ListNode* current = dummy;
      for (int i = 0; i < n; i++) {
          std::cin >> val;
          current->next = new ListNode(val);
          current = current->next;
      }
      return dummy->next;
  }
  
  int main() {
      ListNode* l1 = createListFromInput();
      ListNode* l2 = createListFromInput();
      
      Solution solution;
      ListNode* result = solution.addTwoNumbers(l1, l2);
      
      printList(result);
      
      return 0;
  }`,
          "java": `import java.util.Scanner;
  
  public class Main {
      public static void printList(ListNode head) {
          while (head != null) {
              System.out.print(head.val + " ");
              head = head.next;
          }
      }
  
      public static ListNode createListFromInput(Scanner sc) {
          int n = sc.nextInt();
          ListNode dummy = new ListNode(0);
          ListNode current = dummy;
          for (int i = 0; i < n; i++) {
              current.next = new ListNode(sc.nextInt());
              current = current.next;
          }
          return dummy.next;
      }
  
      public static void main(String[] args) {
          Scanner sc = new Scanner(System.in);
          ListNode l1 = createListFromInput(sc);
          ListNode l2 = createListFromInput(sc);
          
          Solution solution = new Solution();
          ListNode result = solution.addTwoNumbers(l1, l2);
          
          printList(result);
          sc.close();
      }
  }
  
  
  class ListNode {
      int val;
      ListNode next;
      ListNode(int x) { val = x; next = null; }
  }
  
  class Solution {
      public ListNode addTwoNumbers(ListNode l1, ListNode l2) {
          int carry = 0;
          ListNode dummy = new ListNode(0);
          ListNode l = dummy;
          
          while (l1 != null || l2 != null || carry != 0) {
              int sum = carry;
              if (l1 != null) {
                  sum += l1.val;
                  l1 = l1.next;
              }
              if (l2 != null) {
                  sum += l2.val;
                  l2 = l2.next;
              }
              
              carry = sum / 10;
              l.next = new ListNode(sum % 10);
              l = l.next;
          }
          
          return dummy.next;
      }
  }
  
  `
      },
      "hiddenTestCases": [
          { "input": "2\n9 9\n2\n1 1", "output": "0 1 1", "points": 7 },
          { "input": "3\n0 0 1\n3\n0 0 9", "output": "0 0 0 1", "points": 7 },
          { "input": "4\n1 2 3 4\n4\n5 6 7 8", "output": "6 8 0 3 1", "points": 8 },
          { "input": "5\n9 9 9 9 9\n3\n9 9 9", "output": "8 9 9 0 0 1", "points": 8 }
      ],
      "isSubmitted": false
  },
    {
      "id": 3,
      "difficulty": "hard",
      "question": "Given a Directed Acyclic Graph (DAG) with N vertices and M edges, perform a topological sort and return any valid order.",
      "input": "6 6\n5 0\n5 2\n4 0\n4 1\n2 3\n3 1",
      "output": "4 5 0 2 3 1 ",
      "code": {
        "cpp": "#include <bits/stdc++.h>\nusing namespace std;\nvector<int> topologicalSort(int N, vector<vector<int>> &edges) {\n    vector<int> adj[N], inDegree(N, 0), result;\n    queue<int> q;\n    for (auto &e : edges) {\n        adj[e[0]].push_back(e[1]);\n        inDegree[e[1]]++;\n    }\n    for (int i = 0; i < N; i++)\n        if (inDegree[i] == 0) q.push(i);\n    while (!q.empty()) {\n        int node = q.front();\n        q.pop();\n        result.push_back(node);\n        for (int neighbor : adj[node])\n            if (--inDegree[neighbor] == 0) q.push(neighbor);\n    }\n    return result;\n}\nint main() {\n    int N, M;\n    cin >> N >> M;\n    vector<vector<int>> edges(M, vector<int>(2));\n    for (int i = 0; i < M; i++)\n        cin >> edges[i][0] >> edges[i][1];\n    vector<int> topoOrder = topologicalSort(N, edges);\n    for (int node : topoOrder)\n        cout << node << \" \";\n    cout << endl;\n    return 0;\n}",
        
        "java": `import java.util.*;
  
  public class Main {
      public static List<Integer> topologicalSort(int N, List<int[]> edges) {
          @SuppressWarnings("unchecked")
          List<Integer>[] adj = (List<Integer>[]) new ArrayList[N];
          int[] inDegree = new int[N];
          List<Integer> result = new ArrayList<>();
          Queue<Integer> queue = new LinkedList<>();
          for (int i = 0; i < N; i++) adj[i] = new ArrayList<>();
          for (int[] edge : edges) {
              adj[edge[0]].add(edge[1]);
              inDegree[edge[1]]++;
          }
          for (int i = 0; i < N; i++)
              if (inDegree[i] == 0) queue.add(i);
          while (!queue.isEmpty()) {
              int node = queue.poll();
              result.add(node);
              for (int neighbor : adj[node])
                  if (--inDegree[neighbor] == 0) queue.add(neighbor);
          }
          return result;
      }
  
      public static void main(String[] args) {
          Scanner sc = new Scanner(System.in);
          int N = sc.nextInt(), M = sc.nextInt();
          List<int[]> edges = new ArrayList<>();
          for (int i = 0; i < M; i++)
              edges.add(new int[]{sc.nextInt(), sc.nextInt()});
          List<Integer> topoOrder = topologicalSort(N, edges);
          for (int node : topoOrder)
              System.out.print(node + " ");
          System.out.println();
          sc.close();
      }
  }
  `
      },
      "hiddenTestCases": [
        { "input": "5 4\n0 2\n0 3\n1 3\n3 4", "output": "0 1 2 3 4", "points": 6 },
        { "input": "4 3\n0 1\n1 2\n2 3", "output": "0 1 2 3", "points": 7 },
        { "input": "6 7\n5 2\n5 0\n4 0\n4 1\n2 3\n3 1\n1 0", "output": "4 5 2 3 1 0", "points": 7 },
        { "input": "8 8\n0 1\n0 2\n1 3\n1 4\n2 5\n2 6\n3 7\n4 7", "output": "0 1 2 3 4 5 6 7", "points": 10 }
      ],
      "isSubmitted": false
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
  
    public static void main(String[] args) {
      Scanner sc = new Scanner(System.in);
      String s1 = sc.next();
      String s2 = sc.next();
  
      System.out.println(lcs(s1, s2));
    }
  }
  `
      },
      hiddenTestCases: [
        { input: '"apple" "plate"', output: '"ple"', points: 5 },
        { input: '"xyz" "abc"', output: '""', points: 7 },
        { input: '"programming" "gamingworld"', output: '"gaming"', points: 8 }
      ],
      isSubmitted : false,
    }
  ];
  
  export default questions;
  