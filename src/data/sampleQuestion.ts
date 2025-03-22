const questions = [
  {
    "id": 1,
    "difficulty": "hard",
    "question": "Given an N x N chessboard and a knight starting from position (x, y), determine whether the knight can visit every cell exactly once. If possible, return a valid path.",
    "input": "5 0 0",
    "output": "Valid tour exists",
    "code": {
        "cpp": `int ny = y + dy[i];
#include <iostream>
    if (moveCount == N * N) return true;
using namespace std;
    cout << "Valid tour exists" << endl;
const int dx[8] = {2, 1, -1, -2, -2, -1, 1, 2};
    board[nx][ny] = moveCount;
bool solveKnightTour(int x, int y, int moveCount, vector<vector<int>>& board, int N) {
    cout << endl;
    for (int i = 0; i < 8; i++) {
    int N, x, y;
    board[x][y] = 0;
#include <vector>
int main() {
    if (nx >= 0 && ny >= 0 && nx < N && ny < N && board[nx][ny] == -1) {
const int dy[8] = {1, 2, 2, 1, -1, -2, -2, -1};
    for (int j = 0; j < N; j++) {
    cin >> N >> x >> y;
            cout << board[i][j] << " ";
            board[nx][ny] = -1; 
    return 0;
void printBoard(vector<vector<int>>& board, int N) {
    if (solveKnightTour(x, y, 1, board, N)) {
    int nx = x + dx[i];
    vector<vector<int>> board(N, vector<int>(N, -1));
        if (solveKnightTour(nx, ny, moveCount + 1, board, N)) return true;
    }
    return false;
    for (int i = 0; i < N; i++) {
    } else {
        cout << "No valid tour" << endl;
        }
    }
}
}`,
        "java": `static int[] dy = {1, 2, 2, 1, -1, -2, -2, -1};
public class Main {
    int[][] board = new int[N][N];
            board[nx][ny] = -1;
        int ny = y + dy[i];
    static int[] dx = {2, 1, -1, -2, -2, -1, 1, 2};
import java.util.*;
        if (moveCount == N * N) return true;
    int N = sc.nextInt(), x = sc.nextInt(), y = sc.nextInt();
        int nx = x + dx[i];
    static boolean solveKnightTour(int x, int y, int moveCount, int[][] board, int N) {
public static void main(String[] args) {
    for (int i = 0; i < 8; i++) {
            System.out.println("Valid tour exists");
    if (solveKnightTour(x, y, 1, board, N)) {
        board[nx][ny] = moveCount;
        } else {
    board[x][y] = 0;
            System.out.println("No valid tour");
        if (nx >= 0 && ny >= 0 && nx < N && ny < N && board[nx][ny] == -1) {
            if (solveKnightTour(nx, ny, moveCount + 1, board, N)) return true;
    for (int[] row : board) Arrays.fill(row, -1);
        Scanner sc = new Scanner(System.in);
        return false;
    }
        sc.close();
    }
}`
    },
    "hiddenTestCases": [
        { "input": "6 2 2", "output": "Valid tour exists", "points": 4 },
        { "input": "8 0 0", "output": "Valid tour exists", "points": 7 },
        { "input": "4 1 1", "output": "No valid tour", "points": 5 },
        { "input": "5 4 4", "output": "Valid tour exists", "points": 4 }
    ],
    "isSubmitted": false
},
  {
    "id": 2,
    "difficulty": "medium",
    "question": "Given two non-empty linked lists representing two non-negative integers, add the two numbers and return the sum as a linked list.",
    "input": "3\n2 4 3\n3\n5 6 4",
    "output": "7 0 8",
    "code": {
        "cpp": `ListNode* dummy = new ListNode(0);
#include <vector>
    while (head) {
struct ListNode {
    ListNode* next;
class Solution {
    ListNode* l1 = createListFromInput();
    int val;
    ListNode(int x) : val(x), next(nullptr) {}
    int carry = 0;
};
public:
    ListNode* l = dummy;
    ListNode* addTwoNumbers(ListNode* l1, ListNode* l2) {
    if (l1) {
        current->next = new ListNode(val);
#include <iostream>
void printList(ListNode* head) {
    while (l1 || l2 || carry) {
            sum += l1->val;
            l1 = l1->next;
    ListNode* l2 = createListFromInput();
            }
    std::cin >> val;
            if (l2) {
    ListNode* current = dummy;
                sum += l2->val;
    Solution solution;
                l2 = l2->next;
            }
int main() {
            carry = sum / 10;
            std::cout << head->val << " ";
    ListNode* result = solution.addTwoNumbers(l1, l2);
            l->next = new ListNode(sum % 10);
            l = l->next;
    printList(result);
        int sum = carry;
    return dummy->next;
    for (int i = 0; i < n; i++) {
    }
ListNode* createListFromInput() {
    }
    std::cin >> n;
    int n, val;
    head = head->next;
    return 0;
    ListNode* dummy = new ListNode(0);
    }
    return dummy->next;
}`,
        "java": `class ListNode {
import java.util.Scanner;
    ListNode next;
public class Main {
    int val;
    ListNode(int x) { val = x; next = null; }
            l.next = new ListNode(sum % 10);
}
class Solution {
    while (head != null) {
    public static void printList(ListNode head) {
        int n = sc.nextInt();
    public ListNode addTwoNumbers(ListNode l1, ListNode l2) {
            System.out.print(head.val + " ");
            if (l2 != null) {
        ListNode dummy = new ListNode(0);
                current.next = new ListNode(sc.nextInt());
                sum += l2.val;
                l2 = l2.next;
            }
            head = head.next;
        ListNode l = dummy;
    public static ListNode createListFromInput(Scanner sc) {
        int carry = 0;
            carry = sum / 10;
        while (l1 != null || l2 != null || carry != 0) {
            if (l1 != null) {
                sum += l1.val;
        ListNode current = dummy;
                l1 = l1.next;
            }
            for (int i = 0; i < n; i++) {
            l = l.next;
public static void main(String[] args) {
        int sum = carry;
        }
        Scanner sc = new Scanner(System.in);
        return dummy.next;
    }
        ListNode l1 = createListFromInput(sc);
    }
        ListNode l2 = createListFromInput(sc);
        Solution solution = new Solution();
        ListNode result = solution.addTwoNumbers(l1, l2);
        printList(result);
        sc.close();
    return dummy.next;
    }
}`
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
      "cpp": `queue<int> q;
#include <bits/stdc++.h>
    for (int i = 0; i < N; i++)
vector<int> topologicalSort(int N, vector<vector<int>> &edges) {
using namespace std;
    vector<int> adj[N], inDegree(N, 0), result;
int main() {
    for (auto &e : edges) {
    int N, M;
        if (inDegree[i] == 0) q.push(i);
        adj[e[0]].push_back(e[1]);
    cin >> N >> M;
        inDegree[e[1]]++;
    vector<vector<int>> edges(M, vector<int>(2));
    }
    for (int i = 0; i < M; i++)
        result.push_back(node);
    while (!q.empty()) {
        cin >> edges[i][0] >> edges[i][1];
        int node = q.front();
    vector<int> topoOrder = topologicalSort(N, edges);
        q.pop();
    for (int node : topoOrder)
            if (--inDegree[neighbor] == 0) q.push(neighbor);
        cout << node << " ";
        for (int neighbor : adj[node])
    }
    cout << endl;
    return result;
    return 0;
}`,
      "java": `import java.util.*;
public static List<Integer> topologicalSort(int N, List<int[]> edges) {
public class Main {
    List<Integer> result = new ArrayList<>();
            adj[edge[0]].add(edge[1]);
    int[] inDegree = new int[N];
            inDegree[edge[1]]++;
    Queue<Integer> queue = new LinkedList<>();
        for (int i = 0; i < N; i++)
    int N = sc.nextInt(), M = sc.nextInt();
            if (inDegree[i] == 0) queue.add(i);
    for (int i = 0; i < M; i++)
    @SuppressWarnings("unchecked")
        for (int[] edge : edges) {
    List<Integer>[] adj = (List<Integer>[]) new ArrayList[N];
            for (int neighbor : adj[node])
        while (!queue.isEmpty()) {
    List<int[]> edges = new ArrayList<>();
            int node = queue.poll();
public static void main(String[] args) {
    for (int i = 0; i < N; i++) adj[i] = new ArrayList<>();
                if (--inDegree[neighbor] == 0) queue.add(neighbor);
            result.add(node);
        }
    Scanner sc = new Scanner(System.in);
    edges.add(new int[]{sc.nextInt(), sc.nextInt()});
        return result;
    }
    List<Integer> topoOrder = topologicalSort(N, edges);
    for (int node : topoOrder)
        System.out.print(node + " ");
    System.out.println();
    sc.close();
}`
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
    "id": 4,
    "difficulty": "hard",
    "question": "Find the longest common subsequence (LCS) of two strings.",
    "input": '"abcde" "ace"',
    "output": '"ace"',
    "code": {
      "cpp": `#include <vector>
    int n = s2.size(), m = s1.size();
using namespace std;
string lcs(string s1, string s2) {
#include <iostream>
  string s1, s2;
  while (j > 0 && i > 0) {
  vector<vector<int>> dp(m + 1, vector<int>(n + 1, 0));
    for (int i = 1; i <= m; i++) {
int main() {
      if (s1[i - 1] == s2[j - 1])
  cin >> s1 >> s2;
        dp[j][i] = dp[j - 1][i - 1] + 1;
  cout << lcs(s1, s2) << endl;
      else
    if (dp[j][i - 1] > dp[j - 1][i])
  string res = "";
    }
  for (int j = 1; j <= n; j++) {
        dp[j][i] = max(dp[j - 1][i], dp[j][i - 1]);
    int j = n, i = m;
    return 0;
    }
      res = s1[i - 1] + res;
      j--;
    } else if (s1[i - 1] == s2[j - 1]) {
      i--;
  }
  return res;
}
`,
      "java": `import java.util.Scanner;
static String lcs(String s1, String s2) {
public class Main {
    int[][] dp = new int[m + 1][n + 1];
      if (s1.charAt(i - 1) == s2.charAt(j - 1))
    StringBuilder res = new StringBuilder();
    String s1 = sc.next();
    int n = s2.length(), m = s1.length();
          dp[j][i] = dp[j - 1][i - 1] + 1;
    for (int j = 1; j <= n; j++) {
public static void main(String[] args) {
        else
        res.append(s1.charAt(i - 1));
    Scanner sc = new Scanner(System.in);
          dp[j][i] = Math.max(dp[j - 1][i], dp[j][i - 1]);
      for (int i = 1; i <= m; i++) {
    String s2 = sc.next();
    int j = n, i = m;
    while (j > 0 && i > 0) {
    System.out.println(lcs(s1, s2));
        j--; i--;
      } else if (dp[j][i - 1] > dp[j - 1][i])
        j--;
      else
        i--;
    }
    return res.reverse().toString();
  }
}
`
    },
    "hiddenTestCases": [
      { "input": '"apple" "plate"', "output": '"ple"', "points": 5 },
      { "input": '"xyz" "abc"', "output": '""', "points": 7 },
      { "input": '"programming" "gamingworld"', "output": '"gaming"', "points": 8 }
    ],
    "isSubmitted": false
  }
];

export default questions;