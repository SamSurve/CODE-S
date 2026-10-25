import { Subject } from './types';
import { SUBJECT_NAMES } from '../../config';

export const aoa: Subject = {
  id: 'aoa',
  name: SUBJECT_NAMES.aoa,
  items: [
  {
    "id": "a1",
    "expNo": "1.1",
    "title": "Insertion Sort",
    "language": "c",
    "files": [
      {
        "name": "main.c",
        "code": "#include <stdio.h>\n\nint main() {\n    int a[100], n, i, j, key;\n    printf(\"Enter the array size: \");\n    scanf(\"%d\", &n);\n    if (n < 1 || n > 100) { printf(\"Invalid size\\n\"); return 0; }\n    printf(\"Enter the array elements:\\n\");\n    for (i = 0; i < n; i++)\n        scanf(\"%d\", &a[i]);\n\n    for (i = 1; i < n; i++) { /* Insertion Sort */\n        key = a[i];\n        for (j = i - 1; j >= 0 && a[j] > key; j--)\n            a[j + 1] = a[j];\n        a[j + 1] = key;\n    }\n\n    printf(\"Sorted Elements are:\\n\");\n    for (i = 0; i < n; i++)\n        printf(\"%d\\t\", a[i]);\n    printf(\"\\n\");\n    return 0;\n}"
      }
    ],
    "mainFile": "main.c",
    "sampleInput": "5\n55 83 75 23 22",
    "savedOutput": "Enter the array size: 5\nEnter the array elements:\n55 83 75 23 22\nSorted Elements are:\n22 23 55 75 83",
    "mode": "console"
  },
  {
    "id": "a2",
    "expNo": "1.2",
    "title": "Selection Sort",
    "language": "c",
    "files": [
      {
        "name": "main.c",
        "code": "#include <stdio.h>\n\nint main() {\n    int a[100], n, i, j, loc, t;\n    printf(\"Enter the array size: \");\n    scanf(\"%d\", &n);\n    if (n < 1 || n > 100) { printf(\"Invalid size\\n\"); return 0; }\n    printf(\"Enter the array elements:\\n\");\n    for (i = 0; i < n; i++)\n        scanf(\"%d\", &a[i]);\n\n    for (i = 0; i < n - 1; i++) { /* Selection Sort */\n        loc = i;\n        for (j = i + 1; j < n; j++)\n            if (a[j] < a[loc]) loc = j;\n        t = a[i]; a[i] = a[loc]; a[loc] = t;\n    }\n\n    printf(\"Sorted Elements are:\\n\");\n    for (i = 0; i < n; i++)\n        printf(\"%d\\t\", a[i]);\n    printf(\"\\n\");\n    return 0;\n}"
      }
    ],
    "mainFile": "main.c",
    "sampleInput": "6\n55 83 75 23 75 22",
    "savedOutput": "Enter the array size: 6\nEnter the array elements:\n55 83 75 23 75 22\nSorted Elements are:\n22 23 55 75 75 83",
    "mode": "console"
  },
  {
    "id": "a3",
    "expNo": "2",
    "title": "Binary Search",
    "language": "c",
    "files": [
      {
        "name": "main.c",
        "code": "#include <stdio.h>\n\nint main() {\n    int a[100], n, i, key, beg, mid, end, pos = -1;\n    printf(\"Enter the size of array: \");\n    scanf(\"%d\", &n);\n    if (n < 1 || n > 100) { printf(\"Invalid size\\n\"); return 0; }\n    printf(\"Enter elements of array (in sorted order):\\n\");\n    for (i = 0; i < n; i++)\n        scanf(\"%d\", &a[i]);\n    printf(\"Enter the element to be searched: \");\n    scanf(\"%d\", &key);\n\n    beg = 0; end = n - 1;\n    while (beg <= end) { /* Binary Search */\n        mid = (beg + end) / 2;\n        if (a[mid] == key) { pos = mid; break; }\n        if (key < a[mid]) end = mid - 1;\n        else beg = mid + 1;\n    }\n\n    if (pos >= 0)\n        printf(\"Search is Successful, element found at index %d (Position %d)\\n\",\n               pos, pos + 1);\n    else\n        printf(\"Search is Unsuccessful\\n\");\n    return 0;\n}"
      }
    ],
    "mainFile": "main.c",
    "sampleInput": "5\n10 20 30 40 50\n30",
    "savedOutput": "Enter the size of array: 5\nEnter elements of array (in sorted order):\n10 20 30 40 50\nEnter the element to be searched: 30\nSearch is Successful, element found at index 2 (Position 3)",
    "mode": "console"
  },
  {
    "id": "a4",
    "expNo": "3",
    "title": "Dijkstra's Algorithm",
    "language": "c",
    "files": [
      {
        "name": "main.c",
        "code": "#include <stdio.h>\n#define INF 9999\n\nint main() {\n    int n, src, c[11][11], d[11], vis[11] = {0}, i, j, u, min;\n    printf(\"Enter the number of nodes (max 10): \");\n    scanf(\"%d\", &n);\n    if (n < 1 || n > 10) { printf(\"Invalid size\\n\"); return 0; }\n    printf(\"Enter the cost matrix (0 = no edge):\\n\");\n    for (i = 1; i <= n; i++)\n        for (j = 1; j <= n; j++) {\n            scanf(\"%d\", &c[i][j]);\n            if (c[i][j] == 0 && i != j) c[i][j] = INF;\n        }\n    printf(\"Enter the source node: \");\n    scanf(\"%d\", &src);\n    if (src < 1 || src > n) { printf(\"Invalid source\\n\"); return 0; }\n\n    for (i = 1; i <= n; i++) d[i] = INF;\n    d[src] = 0;\n\n    for (i = 1; i <= n; i++) { /* Dijkstra */\n        u = 0; min = INF;\n        for (j = 1; j <= n; j++)\n            if (!vis[j] && d[j] < min) { min = d[j]; u = j; }\n        if (!u) break;\n        vis[u] = 1;\n        for (j = 1; j <= n; j++)\n            if (!vis[j] && d[u] + c[u][j] < d[j])\n                d[j] = d[u] + c[u][j];\n    }\n\n    printf(\"\\nShortest Path:\\n\");\n    for (i = 1; i <= n; i++)\n        if (i != src) {\n            if (d[i] >= INF) printf(\"%d -> %d = No path\\n\", src, i);\n            else printf(\"%d -> %d = %d\\n\", src, i, d[i]);\n        }\n    return 0;\n}"
      }
    ],
    "mainFile": "main.c",
    "sampleInput": "4\n0 10 0 30\n10 0 20 0\n0 20 0 5\n30 0 5 0\n1",
    "savedOutput": "Enter the number of nodes (max 10): 4\nEnter the cost matrix (0 = no edge):\n0 10 0 30\n10 0 20 0\n0 20 0 5\n30 0 5 0\nEnter the source node: 1\n\nShortest Path:\n1 -> 2 = 10\n1 -> 3 = 30\n1 -> 4 = 30",
    "mode": "console"
  },
  {
    "id": "a5",
    "expNo": "4",
    "title": "0/1 Knapsack Problem",
    "language": "c",
    "files": [
      {
        "name": "main.c",
        "code": "#include <stdio.h>\n\nint main() {\n    int n, M, i, j;\n    printf(\"Enter number of items: \");\n    scanf(\"%d\", &n);\n    if (n < 1) { printf(\"Invalid input\\n\"); return 0; }\n    int w[n + 1], p[n + 1];\n    printf(\"Enter weights of items:\\n\");\n    for (i = 1; i <= n; i++) scanf(\"%d\", &w[i]);\n    printf(\"Enter profits of items:\\n\");\n    for (i = 1; i <= n; i++) scanf(\"%d\", &p[i]);\n    printf(\"Enter Knapsack Capacity: \");\n    scanf(\"%d\", &M);\n    if (M < 0) { printf(\"Invalid input\\n\"); return 0; }\n\n    int V[n + 1][M + 1];\n    for (j = 0; j <= M; j++) V[0][j] = 0;\n\n    for (i = 1; i <= n; i++) /* 0/1 Knapsack DP */\n        for (j = 0; j <= M; j++) {\n            V[i][j] = V[i - 1][j];\n            if (w[i] <= j && p[i] + V[i - 1][j - w[i]] > V[i][j])\n                V[i][j] = p[i] + V[i - 1][j - w[i]];\n        }\n\n    printf(\"\\nDP Table:\\n\");\n    for (i = 0; i <= n; i++) {\n        for (j = 0; j <= M; j++) printf(\"%d\\t\", V[i][j]);\n        printf(\"\\n\");\n    }\n\n    printf(\"\\nMaximum Profit = %d\\n\\nSelected Items:\\n\", V[n][M]);\n    for (i = n, j = M; i > 0; i--) /* trace back */\n        if (V[i][j] != V[i - 1][j]) {\n            printf(\"Item %d (Weight=%d, Profit=%d)\\n\", i, w[i], p[i]);\n            j -= w[i];\n        }\n    return 0;\n}"
      }
    ],
    "mainFile": "main.c",
    "sampleInput": "4\n2 3 4 5\n1 2 5 6\n8",
    "savedOutput": "Enter number of items: 4\nEnter weights of items:\n2 3 4 5\nEnter profits of items:\n1 2 5 6\nEnter Knapsack Capacity: 8\n\nDP Table:\n0\t0\t0\t0\t0\t0\t0\t0\t0\t\n0\t0\t1\t1\t1\t1\t1\t1\t1\t\n0\t0\t1\t2\t2\t3\t3\t3\t3\t\n0\t0\t1\t2\t5\t5\t6\t7\t7\t\n0\t0\t1\t2\t5\t6\t6\t7\t8\t\n\nMaximum Profit = 8\n\nSelected Items:\nItem 4 (Weight=5, Profit=6)\nItem 2 (Weight=3, Profit=2)",
    "mode": "console"
  },
  {
    "id": "a6",
    "expNo": "5",
    "title": "Longest Common Subsequence",
    "language": "c",
    "files": [
      {
        "name": "main.c",
        "code": "#include <stdio.h>\n#include <string.h>\n\nint main() {\n    char X[100], Y[100], lcs[100];\n    int dp[100][100], m, n, i, j, len;\n    printf(\"Enter first string: \");\n    scanf(\"%99s\", X);\n    printf(\"Enter second string: \");\n    scanf(\"%99s\", Y);\n    m = strlen(X); n = strlen(Y);\n\n    for (i = 0; i <= m; i++) /* build DP table */\n        for (j = 0; j <= n; j++)\n            if (i == 0 || j == 0) dp[i][j] = 0;\n            else if (X[i - 1] == Y[j - 1]) dp[i][j] = dp[i - 1][j - 1] + 1;\n            else dp[i][j] = dp[i - 1][j] > dp[i][j - 1] ? dp[i - 1][j] : dp[i][j - 1];\n\n    printf(\"\\nDP Matrix:\\n\");\n    for (i = 0; i <= m; i++) {\n        for (j = 0; j <= n; j++) printf(\"%2d \", dp[i][j]);\n        printf(\"\\n\");\n    }\n\n    len = dp[m][n];\n    lcs[len] = '\\0';\n    for (i = m, j = n; i > 0 && j > 0; ) /* trace back */\n        if (X[i - 1] == Y[j - 1]) lcs[--len] = X[i - 1], i--, j--;\n        else if (dp[i - 1][j] >= dp[i][j - 1]) i--;\n        else j--;\n\n    printf(\"\\nLength of LCS = %d\\nLCS = %s\\n\", dp[m][n], lcs);\n    return 0;\n}"
      }
    ],
    "mainFile": "main.c",
    "sampleInput": "ABCBDAB\nBDCABA",
    "savedOutput": "Enter first string: ABCBDAB\nEnter second string: BDCABA\n\nDP Matrix:\n 0  0  0  0  0  0  0 \n 0  0  0  0  1  1  1 \n 0  1  1  1  1  2  2 \n 0  1  1  2  2  2  2 \n 0  1  1  2  2  3  3 \n 0  1  2  2  2  3  3 \n 0  1  2  2  3  3  4 \n 0  1  2  2  3  4  4 \n\nLength of LCS = 4\nLCS = BCBA",
    "mode": "console"
  },
  {
    "id": "a7",
    "expNo": "6",
    "title": "BFS & DFS Graph Traversals",
    "language": "c",
    "files": [
      {
        "name": "main.c",
        "code": "#include <stdio.h>\n\nint a[20][20], vis[20], n;\n\nvoid dfs(int v) { /* recursive DFS */\n    int i;\n    vis[v] = 1;\n    printf(\" %d\", v);\n    for (i = 1; i <= n; i++)\n        if (a[v][i] && !vis[i]) dfs(i);\n}\n\nvoid bfs(int s) { /* queue based BFS */\n    int q[20], f = 0, r = 0, v, i;\n    q[r++] = s; vis[s] = 1;\n    while (f < r) {\n        v = q[f++];\n        printf(\" %d\", v);\n        for (i = 1; i <= n; i++)\n            if (a[v][i] && !vis[i]) { vis[i] = 1; q[r++] = i; }\n    }\n}\n\nint main() {\n    int i, j, s, ch;\n    char c;\n    printf(\"Enter the number of vertices: \");\n    scanf(\"%d\", &n);\n    if (n < 1 || n > 19) { printf(\"Invalid vertices\\n\"); return 0; }\n    printf(\"Enter the adjacency matrix:\\n\");\n    for (i = 1; i <= n; i++)\n        for (j = 1; j <= n; j++) scanf(\"%d\", &a[i][j]);\n\n    do {\n        for (i = 1; i <= n; i++) vis[i] = 0;\n        printf(\"\\nMENU\\n1. B.F.S\\n2. D.F.S\\nEnter your choice: \");\n        scanf(\"%d\", &ch);\n        printf(\"Enter the source vertex: \");\n        scanf(\"%d\", &s);\n        if (s < 1 || s > n || ch < 1 || ch > 2) printf(\"Invalid input.\\n\");\n        else {\n            printf(ch == 1 ? \"BFS order:\" : \"DFS order:\");\n            if (ch == 1) bfs(s); else dfs(s);\n            printf(\"\\n\");\n        }\n        printf(\"\\nDo you want to continue (Y/N)? \");\n        scanf(\" %c\", &c);\n    } while (c == 'y' || c == 'Y');\n    return 0;\n}"
      }
    ],
    "mainFile": "main.c",
    "sampleInput": "4\n0 1 1 0\n1 0 0 1\n1 0 0 1\n0 1 1 0\n1\n1\ny\n2\n1\nn",
    "savedOutput": "Enter the number of vertices: 4\nEnter the adjacency matrix:\n0 1 1 0\n1 0 0 1\n1 0 0 1\n0 1 1 0\n\nMENU\n1. B.F.S\n2. D.F.S\nEnter your choice: 1\nEnter the source vertex: 1\nBFS order: 1 2 3 4\n\nDo you want to continue (Y/N)? y\n\nMENU\n1. B.F.S\n2. D.F.S\nEnter your choice: 2\nEnter the source vertex: 1\nDFS order: 1 2 4 3\n\nDo you want to continue (Y/N)? n",
    "mode": "console"
  },
  {
    "id": "a8",
    "expNo": "7",
    "title": "N-Queen Problem",
    "language": "c",
    "files": [
      {
        "name": "main.c",
        "code": "#include <stdio.h>\n#include <stdlib.h>\n\nint col[20], n, count; /* col[row] = column of queen */\n\nint safe(int r, int c) {\n    int i;\n    for (i = 0; i < r; i++)\n        if (col[i] == c || abs(col[i] - c) == r - i) return 0;\n    return 1;\n}\n\nvoid solve(int r) { /* backtracking */\n    int c, i, j;\n    if (r == n) {\n        printf(\"\\nSolution %d:\\n\", ++count);\n        for (i = 0; i < n; i++) {\n            for (j = 0; j < n; j++) printf(\"%d \", col[i] == j);\n            printf(\"\\n\");\n        }\n        return;\n    }\n    for (c = 0; c < n; c++)\n        if (safe(r, c)) { col[r] = c; solve(r + 1); }\n}\n\nint main() {\n    printf(\"Enter number of queens: \");\n    scanf(\"%d\", &n);\n    if (n < 1 || n > 20) { printf(\"Invalid input\\n\"); return 0; }\n    solve(0);\n    printf(\"\\nTotal possible ways: %d\\n\", count);\n    return 0;\n}"
      }
    ],
    "mainFile": "main.c",
    "sampleInput": "4",
    "savedOutput": "Enter number of queens: 4\n\nSolution 1:\n0 1 0 0 \n0 0 0 1 \n1 0 0 0 \n0 0 1 0 \n\nSolution 2:\n0 0 1 0 \n1 0 0 0 \n0 0 0 1 \n0 1 0 0 \n\nTotal possible ways: 2",
    "mode": "console"
  },
  {
    "id": "a9",
    "expNo": "8",
    "title": "15 Puzzle using Branch and Bound",
    "language": "c",
    "files": [
      {
        "name": "main.c",
        "code": "#include <stdio.h>\n#include <string.h>\n#define MAX 20000\n\ntypedef struct { int m[16], z, g, open; } Node; /* z = blank, g = level */\nNode pool[MAX];\nint goal[16] = {1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,0};\n\nint h(int *m) { /* misplaced tiles */\n    int i, c = 0;\n    for (i = 0; i < 16; i++) if (m[i] && m[i] != goal[i]) c++;\n    return c;\n}\n\nint main() {\n    int s[16] = {1,2,3,4, 5,6,0,8, 9,10,7,11, 13,14,15,12};\n    int dr[4] = {-1, 1, 0, 0}, dc[4] = {0, 0, -1, 1};\n    int cnt = 1, i, k, best, r, c, nz;\n    memcpy(pool[0].m, s, sizeof s);\n    for (i = 0; i < 16; i++) if (!s[i]) pool[0].z = i;\n    pool[0].open = 1;\n\n    while (1) {\n        best = -1; /* pick least (cost + level) */\n        for (i = 0; i < cnt; i++)\n            if (pool[i].open && (best < 0 ||\n                pool[i].g + h(pool[i].m) < pool[best].g + h(pool[best].m))) best = i;\n        if (best < 0 || cnt > MAX - 4) { printf(\"Solution not found.\\n\"); return 0; }\n        Node cur = pool[best];\n        pool[best].open = 0;\n        if (h(cur.m) == 0) {\n            printf(\"Solution found at level %d:\\n\", cur.g);\n            for (i = 0; i < 16; i++) printf(\"%2d%s\", cur.m[i], i % 4 == 3 ? \"\\n\" : \" \");\n            return 0;\n        }\n        for (k = 0; k < 4; k++) { /* slide blank in 4 directions */\n            r = cur.z / 4 + dr[k]; c = cur.z % 4 + dc[k];\n            if (r < 0 || r > 3 || c < 0 || c > 3) continue;\n            nz = r * 4 + c;\n            Node nx = cur;\n            nx.m[cur.z] = nx.m[nz]; nx.m[nz] = 0;\n            nx.z = nz; nx.g = cur.g + 1; nx.open = 1;\n            for (i = 0; i < cnt; i++) /* skip repeated states */\n                if (!memcmp(pool[i].m, nx.m, sizeof nx.m)) break;\n            if (i == cnt) pool[cnt++] = nx;\n        }\n    }\n}"
      }
    ],
    "mainFile": "main.c",
    "sampleInput": "",
    "savedOutput": "Solution found at level 3:\n 1  2  3  4\n 5  6  7  8\n 9 10 11 12\n13 14 15  0",
    "mode": "console"
  },
  {
    "id": "a10",
    "expNo": "9",
    "title": "Naive String Matching",
    "language": "c",
    "files": [
      {
        "name": "main.c",
        "code": "#include <stdio.h>\n#include <string.h>\n\nint main() {\n    char t[100], p[100];\n    int n, m, i, j, found = 0;\n    printf(\"Enter the text: \");\n    scanf(\" %99[^\\n]\", t);\n    printf(\"Enter the pattern to search for: \");\n    scanf(\" %99[^\\n]\", p);\n    n = strlen(t); m = strlen(p);\n\n    for (i = 0; i + m <= n; i++) { /* try every shift */\n        for (j = 0; j < m && t[i + j] == p[j]; j++);\n        if (j == m) {\n            printf(\"Pattern found at index %d\\n\", i);\n            found = 1;\n        }\n    }\n    if (!found) printf(\"Pattern not found in the text.\\n\");\n    return 0;\n}"
      }
    ],
    "mainFile": "main.c",
    "sampleInput": "AABAACAADAABAABA\nAABA",
    "savedOutput": "Enter the text: AABAACAADAABAABA\nEnter the pattern to search for: AABA\nPattern found at index 0\nPattern found at index 9\nPattern found at index 12",
    "mode": "console"
  },
  {
    "id": "a11",
    "expNo": "10",
    "title": "Min-Max Algorithm",
    "language": "c",
    "files": [
      {
        "name": "main.c",
        "code": "#include <stdio.h>\n\nvoid minmax(int a[], int lo, int hi, int *min, int *max) {\n    int mid, mn, mx;\n    if (lo == hi) /* one element */\n        *min = *max = a[lo];\n    else if (hi == lo + 1) { /* two elements */\n        *min = a[lo] < a[hi] ? a[lo] : a[hi];\n        *max = a[lo] < a[hi] ? a[hi] : a[lo];\n    } else { /* divide and conquer */\n        mid = (lo + hi) / 2;\n        minmax(a, lo, mid, min, max);\n        minmax(a, mid + 1, hi, &mn, &mx);\n        if (mn < *min) *min = mn;\n        if (mx > *max) *max = mx;\n    }\n}\n\nint main() {\n    int a[100], n, i, min, max;\n    printf(\"Enter size of array (max 100): \");\n    scanf(\"%d\", &n);\n    if (n < 1 || n > 100) { printf(\"Invalid array size.\\n\"); return 0; }\n    printf(\"Enter elements of the array:\\n\");\n    for (i = 0; i < n; i++) scanf(\"%d\", &a[i]);\n\n    minmax(a, 0, n - 1, &min, &max);\n    printf(\"Maximum element: %d\\n\", max);\n    printf(\"Minimum element: %d\\n\", min);\n    return 0;\n}"
      }
    ],
    "mainFile": "main.c",
    "sampleInput": "5\n5 4 23 1 50",
    "savedOutput": "Enter size of array (max 100): 5\nEnter elements of the array:\n5 4 23 1 50\nMaximum element: 50\nMinimum element: 1",
    "mode": "console"
  }
]
};
