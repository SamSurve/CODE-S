import type { Practical } from '../types';

export const PRACTICALS: Practical[] = [
  {
    id: 'insertion-sort',
    expNumber: 'Experiment 1.1',
    title: 'Insertion Sort',
    category: 'Sorting',
    paradigm: 'Divide & Conquer',
    aim: 'To implement and analyze the Insertion Sort algorithm in C for sorting an array of integers.',
    algorithm: [
      'Start from index i = 1 (considering element at index 0 as sorted).',
      'Store current element key = a[i].',
      'Compare key with elements in the sorted sub-array from j = i - 1 down to 0.',
      'Shift elements greater than key one position to the right (a[j+1] = a[j]).',
      'Place key in its correct sorted position (a[j+1] = key).',
      'Repeat until all n elements are placed in order.'
    ],
    timeComplexity: {
      best: 'O(n) — already sorted array',
      average: 'O(n²)',
      worst: 'O(n²) — reverse sorted array'
    },
    spaceComplexity: 'O(1) auxiliary space (in-place sort)',
    author: 'SIDDHANT SURVE, 101, B-5',
    language: 'c',
    description: 'An efficient in-place comparison sort that builds the final sorted array one item at a time, well-suited for small datasets or nearly sorted arrays.',
    sampleInput: `5
55 83 75 23 22`,
    sampleOutput: `Enter the array size: 5
Enter the array elements:
55 83 75 23 22
Sorted Elements are:
22 23 55 75 83`,
    sourceCode: `#include <stdio.h>

int main() {
    int a[100], n, i, j, key;
    printf("Enter the array size: ");
    scanf("%d", &n);
    if (n < 1 || n > 100) { printf("Invalid size\\n"); return 0; }
    printf("Enter the array elements:\\n");
    for (i = 0; i < n; i++)
        scanf("%d", &a[i]);

    for (i = 1; i < n; i++) { /* Insertion Sort */
        key = a[i];
        for (j = i - 1; j >= 0 && a[j] > key; j--)
            a[j + 1] = a[j];
        a[j + 1] = key;
    }

    printf("Sorted Elements are:\\n");
    for (i = 0; i < n; i++)
        printf("%d\\t", a[i]);
    printf("\\n");
    return 0;
}`
  },
  {
    id: 'selection-sort',
    expNumber: 'Experiment 1.2',
    title: 'Selection Sort',
    category: 'Sorting',
    paradigm: 'Brute Force',
    aim: 'To implement and analyze the Selection Sort algorithm in C for arranging elements in ascending order.',
    algorithm: [
      'Initialize loop for i = 0 to n - 2.',
      'Assume the minimum element index loc = i.',
      'Scan the remaining unsorted subarray from j = i + 1 to n - 1.',
      'If a[j] < a[loc], update loc = j.',
      'Swap the found minimum element a[loc] with the element at index i.',
      'Repeat for each position until array is completely sorted.'
    ],
    timeComplexity: {
      best: 'O(n²)',
      average: 'O(n²)',
      worst: 'O(n²)'
    },
    spaceComplexity: 'O(1) auxiliary space (in-place sort)',
    author: 'SIDDHANT SURVE, 101, B-5',
    language: 'c',
    description: 'A straightforward comparison-based algorithm that divides the list into sorted and unsorted parts, repeatedly selecting the smallest element.',
    sampleInput: `6
55 83 75 23 75 22`,
    sampleOutput: `Enter the array size: 6
Enter the array elements:
55 83 75 23 75 22
Sorted Elements are:
22 23 55 75 75 83`,
    sourceCode: `#include <stdio.h>

int main() {
    int a[100], n, i, j, loc, t;
    printf("Enter the array size: ");
    scanf("%d", &n);
    if (n < 1 || n > 100) { printf("Invalid size\\n"); return 0; }
    printf("Enter the array elements:\\n");
    for (i = 0; i < n; i++)
        scanf("%d", &a[i]);

    for (i = 0; i < n - 1; i++) { /* Selection Sort */
        loc = i;
        for (j = i + 1; j < n; j++)
            if (a[j] < a[loc]) loc = j;
        t = a[i]; a[i] = a[loc]; a[loc] = t;
    }

    printf("Sorted Elements are:\\n");
    for (i = 0; i < n; i++)
        printf("%d\\t", a[i]);
    printf("\\n");
    return 0;
}`
  },
  {
    id: 'binary-search',
    expNumber: 'Experiment 2',
    title: 'Binary Search',
    category: 'Searching',
    paradigm: 'Divide & Conquer',
    aim: 'To implement the Binary Search algorithm in C to search a key element in a sorted integer array.',
    algorithm: [
      'Initialize boundary indices: beg = 0 and end = n - 1.',
      'Compute the middle index: mid = (beg + end) / 2.',
      'If key matches a[mid], record position and break loop.',
      'If key < a[mid], narrow search interval to left half (end = mid - 1).',
      'If key > a[mid], narrow search interval to right half (beg = mid + 1).',
      'Repeat while beg <= end. If pos remains -1, element is not present.'
    ],
    timeComplexity: {
      best: 'O(1) — element found at middle on first check',
      average: 'O(log n)',
      worst: 'O(log n)'
    },
    spaceComplexity: 'O(1) auxiliary space (iterative)',
    author: 'SIDDHANT SURVE, 101, B-5',
    language: 'c',
    description: 'A logarithmic time search technique that halves the search space at every iteration by comparing target against the middle item of a sorted array.',
    sampleInput: `5
10 20 30 40 50
30`,
    sampleOutput: `Enter the size of array: 5
Enter elements of array (in sorted order):
10 20 30 40 50
Enter the element to be searched: 30
Search is Successful, element found at index 2 (Position 3)`,
    sourceCode: `#include <stdio.h>

int main() {
    int a[100], n, i, key, beg, mid, end, pos = -1;
    printf("Enter the size of array: ");
    scanf("%d", &n);
    if (n < 1 || n > 100) { printf("Invalid size\\n"); return 0; }
    printf("Enter elements of array (in sorted order):\\n");
    for (i = 0; i < n; i++)
        scanf("%d", &a[i]);
    printf("Enter the element to be searched: ");
    scanf("%d", &key);

    beg = 0; end = n - 1;
    while (beg <= end) { /* Binary Search */
        mid = (beg + end) / 2;
        if (a[mid] == key) { pos = mid; break; }
        if (key < a[mid]) end = mid - 1;
        else beg = mid + 1;
    }

    if (pos >= 0)
        printf("Search is Successful, element found at index %d (Position %d)\\n",
               pos, pos + 1);
    else
        printf("Search is Unsuccessful\\n");
    return 0;
}`
  },
  {
    id: 'dijkstras-algorithm',
    expNumber: 'Experiment 3',
    title: "Dijkstra's Algorithm",
    category: 'Graph Algorithms',
    paradigm: 'Greedy',
    aim: "To determine single-source shortest paths in a weighted directed/undirected graph using Dijkstra's Greedy Algorithm.",
    algorithm: [
      'Initialize distance array d[] with INF for all nodes and set d[src] = 0.',
      'Initialize visited array vis[] with 0 for all vertices.',
      'Find an unvisited node u with the minimum d[u]. If all reached or u is 0, exit.',
      'Mark node u as visited (vis[u] = 1).',
      'For every unvisited neighbor j of u, relax the edge: if d[u] + cost[u][j] < d[j], update d[j] = d[u] + cost[u][j].',
      'Repeat for all vertices and print the shortest paths from source.'
    ],
    timeComplexity: {
      best: 'O(V²)',
      average: 'O(V²)',
      worst: 'O(V²) with adjacency matrix'
    },
    spaceComplexity: 'O(V²) for adjacency matrix and O(V) for distance table',
    author: 'SIDDHANT SURVE, 101, B-5',
    language: 'c',
    description: 'Solves the single-source shortest path problem for a graph with non-negative edge weights using a greedy choice property.',
    sampleInput: `4
0 10 0 30
10 0 20 0
0 20 0 5
30 0 5 0
1`,
    sampleOutput: `Enter the number of nodes (max 10): 4
Enter the cost matrix (0 = no edge):
0 10 0 30
10 0 20 0
0 20 0 5
30 0 5 0
Enter the source node: 1

Shortest Path:
1 -> 2 = 10
1 -> 3 = 30
1 -> 4 = 30`,
    sourceCode: `#include <stdio.h>
#define INF 9999

int main() {
    int n, src, c[11][11], d[11], vis[11] = {0}, i, j, u, min;
    printf("Enter the number of nodes (max 10): ");
    scanf("%d", &n);
    if (n < 1 || n > 10) { printf("Invalid size\\n"); return 0; }
    printf("Enter the cost matrix (0 = no edge):\\n");
    for (i = 1; i <= n; i++)
        for (j = 1; j <= n; j++) {
            scanf("%d", &c[i][j]);
            if (c[i][j] == 0 && i != j) c[i][j] = INF;
        }
    printf("Enter the source node: ");
    scanf("%d", &src);
    if (src < 1 || src > n) { printf("Invalid source\\n"); return 0; }

    for (i = 1; i <= n; i++) d[i] = INF;
    d[src] = 0;

    for (i = 1; i <= n; i++) { /* Dijkstra */
        u = 0; min = INF;
        for (j = 1; j <= n; j++)
            if (!vis[j] && d[j] < min) { min = d[j]; u = j; }
        if (!u) break;
        vis[u] = 1;
        for (j = 1; j <= n; j++)
            if (!vis[j] && d[u] + c[u][j] < d[j])
                d[j] = d[u] + c[u][j];
    }

    printf("\\nShortest Path:\\n");
    for (i = 1; i <= n; i++)
        if (i != src) {
            if (d[i] >= INF) printf("%d -> %d = No path\\n", src, i);
            else printf("%d -> %d = %d\\n", src, i, d[i]);
        }
    return 0;
}`
  },
  {
    id: 'knapsack-01',
    expNumber: 'Experiment 4',
    title: '0/1 Knapsack Problem',
    category: 'Dynamic Programming',
    paradigm: 'Dynamic Programming',
    aim: 'To maximize total profit in a 0/1 Knapsack of capacity M using 2D dynamic programming table and trace back selected items.',
    algorithm: [
      'Initialize DP table V[n+1][M+1] with base row V[0][j] = 0 for j = 0 to M.',
      'For item i = 1 to n and capacity j = 0 to M:',
      '  Set V[i][j] = V[i - 1][j] (item excluded).',
      '  If weight w[i] <= j, check if including item yields greater profit:',
      '  V[i][j] = max(V[i-1][j], p[i] + V[i-1][j - w[i]]).',
      'Maximum achievable profit is located at V[n][M].',
      'Trace back from (n, M) down to 1: if V[i][j] != V[i-1][j], item i was included; deduct w[i] from j.'
    ],
    timeComplexity: {
      best: 'O(n · M)',
      average: 'O(n · M)',
      worst: 'O(n · M) pseudo-polynomial time'
    },
    spaceComplexity: 'O(n · M) for the DP table',
    author: 'SIDDHANT SURVE, 101, B-5',
    language: 'c',
    description: 'Dynamic programming formulation to determine the subset of non-divisible items that maximizes total value without exceeding knapsack capacity.',
    sampleInput: `4
2 3 4 5
1 2 5 6
8`,
    sampleOutput: `Enter number of items: 4
Enter weights of items:
2 3 4 5
Enter profits of items:
1 2 5 6
Enter Knapsack Capacity: 8

DP Table:
0\t0\t0\t0\t0\t0\t0\t0\t0\t
0\t0\t1\t1\t1\t1\t1\t1\t1\t
0\t0\t1\t2\t2\t3\t3\t3\t3\t
0\t0\t1\t2\t5\t5\t6\t7\t7\t
0\t0\t1\t2\t5\t6\t6\t7\t8\t

Maximum Profit = 8

Selected Items:
Item 4 (Weight=5, Profit=6)
Item 2 (Weight=3, Profit=2)`,
    sourceCode: `#include <stdio.h>

int main() {
    int n, M, i, j;
    printf("Enter number of items: ");
    scanf("%d", &n);
    if (n < 1) { printf("Invalid input\\n"); return 0; }
    int w[n + 1], p[n + 1];
    printf("Enter weights of items:\\n");
    for (i = 1; i <= n; i++) scanf("%d", &w[i]);
    printf("Enter profits of items:\\n");
    for (i = 1; i <= n; i++) scanf("%d", &p[i]);
    printf("Enter Knapsack Capacity: ");
    scanf("%d", &M);
    if (M < 0) { printf("Invalid input\\n"); return 0; }

    int V[n + 1][M + 1];
    for (j = 0; j <= M; j++) V[0][j] = 0;

    for (i = 1; i <= n; i++) /* 0/1 Knapsack DP */
        for (j = 0; j <= M; j++) {
            V[i][j] = V[i - 1][j];
            if (w[i] <= j && p[i] + V[i - 1][j - w[i]] > V[i][j])
                V[i][j] = p[i] + V[i - 1][j - w[i]];
        }

    printf("\\nDP Table:\\n");
    for (i = 0; i <= n; i++) {
        for (j = 0; j <= M; j++) printf("%d\\t", V[i][j]);
        printf("\\n");
    }

    printf("\\nMaximum Profit = %d\\n\\nSelected Items:\\n", V[n][M]);
    for (i = n, j = M; i > 0; i--) /* trace back */
        if (V[i][j] != V[i - 1][j]) {
            printf("Item %d (Weight=%d, Profit=%d)\\n", i, w[i], p[i]);
            j -= w[i];
        }
    return 0;
}`
  },
  {
    id: 'lcs',
    expNumber: 'Experiment 5',
    title: 'Longest Common Subsequence',
    category: 'Dynamic Programming',
    paradigm: 'Dynamic Programming',
    aim: 'To find the length and characters of the Longest Common Subsequence (LCS) of two input strings using Dynamic Programming.',
    algorithm: [
      'Let string X have length m and string Y have length n.',
      'Initialize dp[m+1][n+1] matrix where dp[i][0] = 0 and dp[0][j] = 0.',
      'Iterate i = 1 to m and j = 1 to n:',
      '  If X[i - 1] == Y[j - 1], then dp[i][j] = dp[i - 1][j - 1] + 1.',
      '  Else dp[i][j] = max(dp[i - 1][j], dp[i][j - 1]).',
      'The length of LCS is dp[m][n].',
      'Backtrack from (m, n) using the dp matrix to reconstruct the subsequence string.'
    ],
    timeComplexity: {
      best: 'O(m · n)',
      average: 'O(m · n)',
      worst: 'O(m · n)'
    },
    spaceComplexity: 'O(m · n) for DP table',
    author: 'SIDDHANT SURVE, 101, B-5',
    language: 'c',
    description: 'Finds the longest subsequence present in both strings in the same relative order (not necessarily contiguous) using bottom-up tabulation.',
    sampleInput: `ABCBDAB
BDCABA`,
    sampleOutput: `Enter first string: ABCBDAB
Enter second string: BDCABA

DP Matrix:
 0  0  0  0  0  0  0 
 0  0  0  0  1  1  1 
 0  1  1  1  1  2  2 
 0  1  1  2  2  2  2 
 0  1  1  2  2  3  3 
 0  1  2  2  2  3  3 
 0  1  2  2  3  3  4 
 0  1  2  2  3  4  4 

Length of LCS = 4
LCS = BCBA`,
    sourceCode: `#include <stdio.h>
#include <string.h>

int main() {
    char X[100], Y[100], lcs[100];
    int dp[100][100], m, n, i, j, len;
    printf("Enter first string: ");
    scanf("%99s", X);
    printf("Enter second string: ");
    scanf("%99s", Y);
    m = strlen(X); n = strlen(Y);

    for (i = 0; i <= m; i++) /* build DP table */
        for (j = 0; j <= n; j++)
            if (i == 0 || j == 0) dp[i][j] = 0;
            else if (X[i - 1] == Y[j - 1]) dp[i][j] = dp[i - 1][j - 1] + 1;
            else dp[i][j] = dp[i - 1][j] > dp[i][j - 1] ? dp[i - 1][j] : dp[i][j - 1];

    printf("\\nDP Matrix:\\n");
    for (i = 0; i <= m; i++) {
        for (j = 0; j <= n; j++) printf("%2d ", dp[i][j]);
        printf("\\n");
    }

    len = dp[m][n];
    lcs[len] = '\\0';
    for (i = m, j = n; i > 0 && j > 0; ) /* trace back */
        if (X[i - 1] == Y[j - 1]) lcs[--len] = X[i - 1], i--, j--;
        else if (dp[i - 1][j] >= dp[i][j - 1]) i--;
        else j--;

    printf("\\nLength of LCS = %d\\nLCS = %s\\n", dp[m][n], lcs);
    return 0;
}`
  },
  {
    id: 'bfs-dfs',
    expNumber: 'Experiment 6',
    title: 'BFS & DFS Graph Traversals',
    category: 'Graph Algorithms',
    paradigm: 'Divide & Conquer',
    aim: 'To implement menu-driven Breadth First Search (BFS) and Depth First Search (DFS) traversals on a graph.',
    algorithm: [
      'Represent graph as an adjacency matrix a[20][20].',
      'BFS Algorithm (Queue based): Enqueue source, mark visited. While queue not empty, dequeue node v, print it, and enqueue all unvisited neighbors.',
      'DFS Algorithm (Recursive): Mark current node v visited and print it. For every neighbor i adjacent to v that is not visited, recursively call dfs(i).',
      'Provide interactive menu to choose between BFS and DFS with custom source vertex.'
    ],
    timeComplexity: {
      best: 'O(V + E)',
      average: 'O(V²)',
      worst: 'O(V²) with adjacency matrix representation'
    },
    spaceComplexity: 'O(V) for visited and queue data structures',
    author: 'SIDDHANT SURVE, 101, B-5',
    language: 'c',
    description: 'Fundamental graph traversal algorithms: BFS traverses level-by-level using a FIFO queue, while DFS searches as deep as possible recursively before backtracking.',
    sampleInput: `4
0 1 1 0
1 0 0 1
1 0 0 1
0 1 1 0
1
1
y
2
1
n`,
    sampleOutput: `Enter the number of vertices: 4
Enter the adjacency matrix:
0 1 1 0
1 0 0 1
1 0 0 1
0 1 1 0

MENU
1. B.F.S
2. D.F.S
Enter your choice: 1
Enter the source vertex: 1
BFS order: 1 2 3 4

Do you want to continue (Y/N)? y

MENU
1. B.F.S
2. D.F.S
Enter your choice: 2
Enter the source vertex: 1
DFS order: 1 2 4 3

Do you want to continue (Y/N)? n`,
    sourceCode: `#include <stdio.h>

int a[20][20], vis[20], n;

void dfs(int v) { /* recursive DFS */
    int i;
    vis[v] = 1;
    printf(" %d", v);
    for (i = 1; i <= n; i++)
        if (a[v][i] && !vis[i]) dfs(i);
}

void bfs(int s) { /* queue based BFS */
    int q[20], f = 0, r = 0, v, i;
    q[r++] = s; vis[s] = 1;
    while (f < r) {
        v = q[f++];
        printf(" %d", v);
        for (i = 1; i <= n; i++)
            if (a[v][i] && !vis[i]) { vis[i] = 1; q[r++] = i; }
    }
}

int main() {
    int i, j, s, ch;
    char c;
    printf("Enter the number of vertices: ");
    scanf("%d", &n);
    if (n < 1 || n > 19) { printf("Invalid vertices\\n"); return 0; }
    printf("Enter the adjacency matrix:\\n");
    for (i = 1; i <= n; i++)
        for (j = 1; j <= n; j++) scanf("%d", &a[i][j]);

    do {
        for (i = 1; i <= n; i++) vis[i] = 0;
        printf("\\nMENU\\n1. B.F.S\\n2. D.F.S\\nEnter your choice: ");
        scanf("%d", &ch);
        printf("Enter the source vertex: ");
        scanf("%d", &s);
        if (s < 1 || s > n || ch < 1 || ch > 2) printf("Invalid input.\\n");
        else {
            printf(ch == 1 ? "BFS order:" : "DFS order:");
            if (ch == 1) bfs(s); else dfs(s);
            printf("\\n");
        }
        printf("\\nDo you want to continue (Y/N)? ");
        scanf(" %c", &c);
    } while (c == 'y' || c == 'Y');
    return 0;
}`
  },
  {
    id: 'n-queens',
    expNumber: 'Experiment 7',
    title: 'N-Queen Problem',
    category: 'Backtracking',
    paradigm: 'Backtracking',
    aim: 'To position N non-attacking queens on an N x N chessboard using recursive backtracking.',
    algorithm: [
      'Maintain an array col[row] to store the column index of each queen at row r.',
      'Check safety function safe(r, c): ensure no previous queen at row i shares column c or diagonal (|col[i] - c| == r - i).',
      'In solve(r): if r == n, print valid board configuration and increment solution count.',
      'For column c = 0 to n - 1:',
      '  If safe(r, c) is true, place queen at col[r] = c and recursively call solve(r + 1).',
      '  If placement fails down the tree, backtrack and test subsequent columns.'
    ],
    timeComplexity: {
      best: 'O(N!)',
      average: 'O(N!)',
      worst: 'O(N!)'
    },
    spaceComplexity: 'O(N) for recursion call stack and position array',
    author: 'SIDDHANT SURVE, 101, B-5',
    language: 'c',
    description: 'Classic backtracking challenge of placing N queens on an N x N board such that no two queens threaten each other horizontally, vertically, or diagonally.',
    sampleInput: `4`,
    sampleOutput: `Enter number of queens: 4

Solution 1:
0 1 0 0 
0 0 0 1 
1 0 0 0 
0 0 1 0 

Solution 2:
0 0 1 0 
1 0 0 0 
0 0 0 1 
0 1 0 0 

Total possible ways: 2`,
    sourceCode: `#include <stdio.h>
#include <stdlib.h>

int col[20], n, count; /* col[row] = column of queen */

int safe(int r, int c) {
    int i;
    for (i = 0; i < r; i++)
        if (col[i] == c || abs(col[i] - c) == r - i) return 0;
    return 1;
}

void solve(int r) { /* backtracking */
    int c, i, j;
    if (r == n) {
        printf("\\nSolution %d:\\n", ++count);
        for (i = 0; i < n; i++) {
            for (j = 0; j < n; j++) printf("%d ", col[i] == j);
            printf("\\n");
        }
        return;
    }
    for (c = 0; c < n; c++)
        if (safe(r, c)) { col[r] = c; solve(r + 1); }
}

int main() {
    printf("Enter number of queens: ");
    scanf("%d", &n);
    if (n < 1 || n > 20) { printf("Invalid input\\n"); return 0; }
    solve(0);
    printf("\\nTotal possible ways: %d\\n", count);
    return 0;
}`
  },
  {
    id: '15-puzzle',
    expNumber: 'Experiment 8',
    title: '15 Puzzle using Branch and Bound',
    category: 'Branch & Bound',
    paradigm: 'Branch & Bound',
    aim: 'To solve the 15-Puzzle sliding tile problem using Branch and Bound with a misplaced tile heuristic evaluation function.',
    algorithm: [
      'Define Node structure containing board state m[16], blank position z, path cost g, and open status.',
      'Heuristic function h(m): counts number of misplaced tiles compared to goal configuration {1,2,3...15,0}.',
      'Start with initial puzzle state in pool[0] at level g = 0.',
      'At each iteration, select active node with minimum estimated cost f = g + h.',
      'If h(cur.m) == 0, goal state reached; print current solution level and state.',
      'Generate children by sliding blank tile in 4 valid directions (up, down, left, right).',
      'Prune duplicated states and add promising children to search pool.'
    ],
    timeComplexity: {
      best: 'O(b^d) where b is branching factor and d is depth',
      average: 'Exponential depending on heuristic tightness',
      worst: 'O(4^d)'
    },
    spaceComplexity: 'O(MAX) state pool memory',
    author: 'SIDDHANT SURVE, 101, B-5',
    language: 'c',
    description: 'Explores state-space tree of sliding 15 numbers within a 4x4 grid into target sequential order using branch and bound least-cost search.',
    sampleInput: ``,
    sampleOutput: `Solution found at level 3:
 1  2  3  4
 5  6  7  8
 9 10 11 12
13 14 15  0`,
    sourceCode: `#include <stdio.h>
#include <string.h>
#define MAX 20000

typedef struct { int m[16], z, g, open; } Node; /* z = blank, g = level */
Node pool[MAX];
int goal[16] = {1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,0};

int h(int *m) { /* misplaced tiles */
    int i, c = 0;
    for (i = 0; i < 16; i++) if (m[i] && m[i] != goal[i]) c++;
    return c;
}

int main() {
    int s[16] = {1,2,3,4, 5,6,0,8, 9,10,7,11, 13,14,15,12};
    int dr[4] = {-1, 1, 0, 0}, dc[4] = {0, 0, -1, 1};
    int cnt = 1, i, k, best, r, c, nz;
    memcpy(pool[0].m, s, sizeof s);
    for (i = 0; i < 16; i++) if (!s[i]) pool[0].z = i;
    pool[0].open = 1;

    while (1) {
        best = -1; /* pick least (cost + level) */
        for (i = 0; i < cnt; i++)
            if (pool[i].open && (best < 0 ||
                pool[i].g + h(pool[i].m) < pool[best].g + h(pool[best].m))) best = i;
        if (best < 0 || cnt > MAX - 4) { printf("Solution not found.\\n"); return 0; }
        Node cur = pool[best];
        pool[best].open = 0;
        if (h(cur.m) == 0) {
            printf("Solution found at level %d:\\n", cur.g);
            for (i = 0; i < 16; i++) printf("%2d%s", cur.m[i], i % 4 == 3 ? "\\n" : " ");
            return 0;
        }
        for (k = 0; k < 4; k++) { /* slide blank in 4 directions */
            r = cur.z / 4 + dr[k]; c = cur.z % 4 + dc[k];
            if (r < 0 || r > 3 || c < 0 || c > 3) continue;
            nz = r * 4 + c;
            Node nx = cur;
            nx.m[cur.z] = nx.m[nz]; nx.m[nz] = 0;
            nx.z = nz; nx.g = cur.g + 1; nx.open = 1;
            for (i = 0; i < cnt; i++) /* skip repeated states */
                if (!memcmp(pool[i].m, nx.m, sizeof nx.m)) break;
            if (i == cnt) pool[cnt++] = nx;
        }
    }
}`
  },
  {
    id: 'naive-string-matching',
    expNumber: 'Experiment 9',
    title: 'Naive String Matching',
    category: 'String Matching',
    paradigm: 'Brute Force',
    aim: 'To locate all occurrences of a pattern string P in a text string T using the Naive / Brute Force algorithm.',
    algorithm: [
      'Read text t of length n and pattern p of length m.',
      'Slide pattern across text: loop i from 0 up to n - m.',
      'For each shift i, compare pattern characters against substring t[i ... i + m - 1].',
      'If all characters match (j == m), record and print match occurrence at shift index i.',
      'If no matches were identified throughout the text, notify user.'
    ],
    timeComplexity: {
      best: 'O(n) when pattern mismatch occurs on first character',
      average: 'O(n + m)',
      worst: 'O((n - m + 1) · m)'
    },
    spaceComplexity: 'O(1) auxiliary space',
    author: 'SIDDHANT SURVE, 101, B-5',
    language: 'c',
    description: 'Sliding window string matching that checks all possible positions where the pattern could match the text without preprocessing.',
    sampleInput: `AABAACAADAABAABA
AABA`,
    sampleOutput: `Enter the text: AABAACAADAABAABA
Enter the pattern to search for: AABA
Pattern found at index 0
Pattern found at index 9
Pattern found at index 12`,
    sourceCode: `#include <stdio.h>
#include <string.h>

int main() {
    char t[100], p[100];
    int n, m, i, j, found = 0;
    printf("Enter the text: ");
    scanf(" %99[^\\n]", t);
    printf("Enter the pattern to search for: ");
    scanf(" %99[^\\n]", p);
    n = strlen(t); m = strlen(p);

    for (i = 0; i + m <= n; i++) { /* try every shift */
        for (j = 0; j < m && t[i + j] == p[j]; j++);
        if (j == m) {
            printf("Pattern found at index %d\\n", i);
            found = 1;
        }
    }
    if (!found) printf("Pattern not found in the text.\\n");
    return 0;
}`
  },
  {
    id: 'min-max',
    expNumber: 'Experiment 10',
    title: 'Min-Max Algorithm',
    category: 'Divide & Conquer',
    paradigm: 'Divide & Conquer',
    aim: 'To find the minimum and maximum elements in an array using the Divide and Conquer strategy.',
    algorithm: [
      'In minmax(a, lo, hi, *min, *max):',
      'Base Case 1: If lo == hi (single element), set *min = *max = a[lo].',
      'Base Case 2: If hi == lo + 1 (two elements), compare once and assign smaller to *min, larger to *max.',
      'Divide Step: If more than 2 elements, calculate mid = (lo + hi) / 2.',
      'Conquer: Recursively compute min & max of left half (lo to mid) and right half (mid+1 to hi).',
      'Combine: Set overall min = min(mn, *min) and max = max(mx, *max).'
    ],
    timeComplexity: {
      best: 'O(n) with 3n/2 - 2 comparisons',
      average: 'O(n)',
      worst: 'O(n) — significantly fewer comparisons than standard linear scan (2n - 2)'
    },
    spaceComplexity: 'O(log n) stack space for recursive calls',
    author: 'SIDDHANT SURVE, 101, B-5',
    language: 'c',
    description: 'Finds both extreme values in an array in a single recursive sweep, cutting comparison count down to 3n/2 - 2 using divide and conquer.',
    sampleInput: `5
5 4 23 1 50`,
    sampleOutput: `Enter size of array (max 100): 5
Enter elements of the array:
5 4 23 1 50
Maximum element: 50
Minimum element: 1`,
    sourceCode: `#include <stdio.h>

void minmax(int a[], int lo, int hi, int *min, int *max) {
    int mid, mn, mx;
    if (lo == hi) /* one element */
        *min = *max = a[lo];
    else if (hi == lo + 1) { /* two elements */
        *min = a[lo] < a[hi] ? a[lo] : a[hi];
        *max = a[lo] < a[hi] ? a[hi] : a[lo];
    } else { /* divide and conquer */
        mid = (lo + hi) / 2;
        minmax(a, lo, mid, min, max);
        minmax(a, mid + 1, hi, &mn, &mx);
        if (mn < *min) *min = mn;
        if (mx > *max) *max = mx;
    }
}

int main() {
    int a[100], n, i, min, max;
    printf("Enter size of array (max 100): ");
    scanf("%d", &n);
    if (n < 1 || n > 100) { printf("Invalid array size.\\n"); return 0; }
    printf("Enter elements of the array:\\n");
    for (i = 0; i < n; i++) scanf("%d", &a[i]);

    minmax(a, 0, n - 1, &min, &max);
    printf("Maximum element: %d\\n", max);
    printf("Minimum element: %d\\n", min);
    return 0;
}`
  }
];

export const CATEGORIES = [
  'All',
  'Sorting',
  'Searching',
  'Divide & Conquer',
  'Dynamic Programming',
  'Graph Algorithms',
  'Backtracking',
  'Branch & Bound',
  'String Matching'
] as const;

export const PARADIGMS = [
  'All',
  'Divide & Conquer',
  'Dynamic Programming',
  'Greedy',
  'Backtracking',
  'Branch & Bound',
  'Brute Force'
] as const;

export const DEFAULT_C_STARTER = `#include <stdio.h>

int main() {
    printf("Hello from Online Compiler!\\n");
    return 0;
}
`;

export const DEFAULT_CPP_STARTER = `#include <iostream>
using namespace std;

int main() {
    cout << "Hello from Online Compiler (C++)!" << endl;
    return 0;
}
`;
