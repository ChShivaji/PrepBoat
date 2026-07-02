# Advanced Professional-Grade Interview Question Repository & Matching Engine
# Sourced from Google, GeeksforGeeks, and industry best practices.
import re

# 1. FRONTEND_QUESTIONS (50 Items)
FRONTEND_QUESTIONS = [
    {"question": "Explain closures in JavaScript and how they are used for data encapsulation.", "category": "Technical", "hint": "A closure is a function that retains access to its lexical scope even when executed outside that scope. Encapsulation: `const counter = () => { let c = 0; return { inc: () => ++c, get: () => c } }`."},
    {"question": "How does prototypal inheritance work in JavaScript? Explain the prototype chain.", "category": "Technical", "hint": "Every JS object has an internal link to another object called its prototype. Properties are searched up the prototype chain until found or null is reached."},
    {"question": "Detail the JS Event Loop, microtasks, and macrotasks.", "category": "Technical", "hint": "Single-threaded JS schedules async tasks. The call stack runs sync code. When empty, it drains the entire Microtask queue (Promises), then executes one Macrotask (setTimeout)."},
    {"question": "What is hoisting in JavaScript? How do let, const, and var differ in hoisting?", "category": "Technical", "hint": "`var` is hoisted and initialized as `undefined`. `let` and `const` are hoisted but remain uninitialized in the Temporal Dead Zone (TDZ)."},
    {"question": "Compare == and === in JavaScript.", "category": "Technical", "hint": "`==` performs type coercion before comparing values, while `===` (strict equality) compares both value and type without conversion."},
    {"question": "What is the difference between let, const, and var scopes?", "category": "Technical", "hint": "`var` is function-scoped and can be redeclared. `let` and `const` are block-scoped and cannot be redeclared in the same block; `const` cannot be reassigned."},
    {"question": "Explain debouncing vs throttling with practical use cases.", "category": "Technical", "hint": "Debouncing delays function execution until a quiet period has elapsed (search inputs). Throttling limits execution to once per time interval (window resize/scroll)."},
    {"question": "How do Promises work? Explain Promise.all vs Promise.allSettled.", "category": "Technical", "hint": "Promises handle async actions. `Promise.all` rejects immediately if any promise fails. `Promise.allSettled` waits for all to resolve/reject and returns details."},
    {"question": "How is the 'this' keyword bound in JavaScript?", "category": "Technical", "hint": "`this` binding is dynamic: 1. Implicit (method owner), 2. Explicit (call/apply/bind), 3. New binding (constructor), 4. Lexical (arrow functions inherit parent scope)."},
    {"question": "What is CORS and how do you resolve it during frontend development?", "category": "Technical", "hint": "Cross-Origin Resource Sharing restricts domain requests. Resolve locally using Vite/Webpack proxy configurations or adding CORS headers on the backend."},
    {"question": "What is the Virtual DOM and how does React's diffing algorithm work?", "category": "Technical", "hint": "React maintains a virtual copy of the DOM. When state changes, it compares the virtual trees (diffing) and updates only the modified nodes (reconciliation) in $O(N)$ time."},
    {"question": "What are the rules of React Hooks? Why can't hooks be called conditionally?", "category": "Technical", "hint": "Rules: 1. Only call hooks at the top level. 2. Only call from functional components/custom hooks. React maps state to components based on hook execution order."},
    {"question": "Explain React's useMemo vs useCallback.", "category": "Technical", "hint": "`useMemo` caches the returned value of an expensive computation, while `useCallback` caches the actual function reference to prevent child re-renders."},
    {"question": "What is the difference between state and props in React?", "category": "Technical", "hint": "State represents mutable local data managed within the component. Props are read-only properties passed down by parent components."},
    {"question": "How do you handle API loading, success, and error states in a React component?", "category": "Project-Based", "hint": "Define state variables: `loading` (bool), `data` (object/array), and `error` (string/null). Render spinners during loading, map data on success, and show alert UI on error."},
    {"question": "Explain Controlled vs Uncontrolled components in React.", "category": "Technical", "hint": "Controlled components bind their values to state and update via `onChange`. Uncontrolled components read values directly from the DOM using refs (`useRef`)."},
    {"question": "What are React Server Components (RSC) and how do they differ from Client Components?", "category": "Technical", "hint": "RSCs render on the server to reduce client bundle size and allow direct database access. Client components ('use client') hydrate in the browser for interactivity."},
    {"question": "What is React StrictMode and what does it do in development?", "category": "Technical", "hint": "A development helper that highlights potential issues: double-renders components to find side-effects and warns about deprecated APIs."},
    {"question": "How do you modularize a large React codebase for reuse?", "category": "Project-Based", "hint": "Extract UI primitives (Button, Input, Modal) to a shared design folder. Modularize feature components and encapsulate logic in custom hooks."},
    {"question": "Explain React Context API. When should you use Redux Toolkit or Zustand instead?", "category": "Technical", "hint": "Context shares global state but triggers re-renders on all consumers. Use Redux or Zustand for complex, high-frequency updates due to granular selectors."},
    {"question": "What are React Portals and when would you use them?", "category": "Technical", "hint": "Portals render children into a DOM node outside the parent hierarchy. Useful for modals, tooltips, and dropdowns that require bypassing CSS overflow rules."},
    {"question": "Explain React's Suspense and lazy loading.", "category": "Technical", "hint": "`React.lazy` dynamically imports components. `Suspense` displays a fallback UI (like a loading skeleton) while the bundle is being fetched in the background."},
    {"question": "What is the difference between class-based lifecycle methods and React hooks?", "category": "Technical", "hint": "Class lifecycles (`componentDidMount`, `componentDidUpdate`) organize logic by execution phase. Hooks (`useEffect`) group logic by concern/feature."},
    {"question": "How does Next.js SSR differ from SSG and ISR?", "category": "Technical", "hint": "SSR generates HTML on each request. SSG builds pages once at compile-time. ISR updates static pages in the background after a specified interval without rebuilding the entire app."},
    {"question": "What is hydration mismatch in Next.js/SSR and how do you fix it?", "category": "Technical", "hint": "Occurs when server-rendered HTML differs from client-side initial render (e.g. using `window` or dynamic dates). Fix by placing logic in `useEffect`."},
    {"question": "Explain CSS specificity rules.", "category": "Technical", "hint": "Specificity is calculated as weights: Inline styles (1000) > IDs (100) > Classes/attributes (10) > Elements/pseudo-elements (1). `!important` overrides all."},
    {"question": "Compare Flexbox and Grid layouts. When do you use each?", "category": "Technical", "hint": "Flexbox is 1-dimensional (aligning elements in a row OR column). Grid is 2-dimensional (columns AND rows), ideal for complex page layouts."},
    {"question": "What are CSS custom properties (variables) and how do they differ from Sass variables?", "category": "Technical", "hint": "CSS variables (`--var`) are evaluated dynamically at runtime by the browser and respect the DOM scope. Sass variables are compiled to static values at build time."},
    {"question": "What are Web Vitals? Explain LCP, FID, and CLS.", "category": "Technical", "hint": "LCP (Largest Contentful Paint) measures loading speed. FID (First Input Delay) measures responsiveness. CLS (Cumulative Layout Shift) measures visual stability."},
    {"question": "How do you optimize a React app's bundle size?", "category": "Technical", "hint": "Use code splitting (`React.lazy`), analyze bundles with `Webpack Bundle Analyzer`, strip unused libraries, configure tree shaking, and compress assets."},
    {"question": "How does HTTP/2 multiplexing benefit frontend loading?", "category": "Technical", "hint": "Allows sending multiple request and response messages concurrently over a single TCP connection, eliminating the head-of-line blocking problem."},
    {"question": "What is a CORS preflight request?", "category": "Technical", "hint": "An HTTP `OPTIONS` request sent by browsers before the actual request to verify if the server permits cross-origin requests from the client domain."},
    {"question": "Compare WebSockets and Server-Sent Events (SSE).", "category": "Technical", "hint": "WebSockets support bi-directional, real-time TCP communication. SSE supports uni-directional server-to-client streaming over standard HTTP."},
    {"question": "What is a Service Worker? Mention two common use cases.", "category": "Technical", "hint": "A script that runs in the browser background. Use cases: Caching assets for offline access, handling push notifications, and intercepting network requests."},
    {"question": "Compare LocalStorage, SessionStorage, and HTTP-only Cookies.", "category": "Technical", "hint": "LocalStorage persists permanently. SessionStorage clears when the tab closes. HTTP-only cookies are sent automatically with requests and are protected from XSS scripts."},
    {"question": "Explain the virtual DOM reconciliation process key variable.", "category": "Technical", "hint": "React uses the `key` prop to identify unique elements in lists. It helps the diffing algorithm match elements across renders to prevent unnecessary re-creations."},
    {"question": "How do you implement a secure JWT authentication flow on the frontend?", "category": "Project-Based", "hint": "Store the JWT in memory (React state) or in an HTTP-only cookie. Use Axios interceptors to attach the token in headers and handle automatic token refresh on expiry."},
    {"question": "What is Tailwind CSS and what are its pros and cons?", "category": "Technical", "hint": "Tailwind is a utility-first CSS framework. Pros: rapid UI styling directly in HTML, small production builds. Cons: cluttered HTML class names, initial learning curve."},
    {"question": "Explain the difference between event bubbling and event capturing.", "category": "Technical", "hint": "Bubbling propagates an event from the target element up to parent nodes. Capturing propagates down from parent nodes to the target element."},
    {"question": "How do you handle routing guards in React Router?", "category": "Project-Based", "hint": "Create a wrapper component (e.g. `ProtectedRoute`) that checks user authentication context. If authenticated, render children (or `<Outlet />`); otherwise, redirect to `/login`."},
    {"question": "What is the Purpose of `useRef` in React? Give two use cases.", "category": "Technical", "hint": "`useRef` creates a mutable object whose `.current` property persists across renders without triggering a re-render. Use cases: accessing DOM nodes, storing timers."},
    {"question": "How do you implement dark mode in a modern web application?", "category": "Project-Based", "hint": "Toggle a `dark` class on the `<html>` or `<body>` element. Use Tailwind's `dark:` variant or CSS variables to swap color palettes dynamically based on theme state."},
    {"question": "Explain structural design patterns in CSS like BEM.", "category": "Technical", "hint": "BEM (Block, Element, Modifier) is a naming convention: `block__element--modifier`. It enforces modular, readable, and non-conflicting styles."},
    {"question": "What is infinite scrolling? How do you implement it efficiently?", "category": "Project-Based", "hint": "Loads more content as the user scrolls. Implement efficiently using the `IntersectionObserver` API to trigger fetch requests when a sentinel element enters the viewport."},
    {"question": "How do you test React components? Describe your testing stack.", "category": "Project-Based", "hint": "Use Jest as the runner and React Testing Library (RTL) for rendering. Test user interactions and assertions on the rendered output rather than implementation details."},
    {"question": "Explain CSS Flexbox layout properties: justify-content vs align-items.", "category": "Technical", "hint": "`justify-content` aligns items along the main axis (horizontal by default), while `align-items` aligns items along the cross axis (vertical by default)."},
    {"question": "How do you prevent unnecessary renders in React?", "category": "Technical", "hint": "Wrap child components in `React.memo`, utilize primitive keys, wrap functions/objects in `useCallback`/`useMemo`, and structure local state close to where it's used."},
    {"question": "What are semantic HTML tags and why are they important?", "category": "Technical", "hint": "Tags like `<article>`, `<section>`, `<header>`, and `<footer>` describe their meaning to both browser and developer. Crucial for SEO and screen-reader accessibility."},
    {"question": "Explain micro-frontend architecture in modern web apps.", "category": "Technical", "hint": "An architectural style where a frontend application is split into independent sub-apps deployed separately and stitched together using module federation."},
    {"question": "What is standard error boundary error catching in React?", "category": "Technical", "hint": "Class components implementing `getDerivedStateFromError` or `componentDidCatch` capture errors in child hierarchies to render a fallback UI instead of crashing."}
]

# 2. DATA_QUESTIONS (50 Items)
DATA_QUESTIONS = [
    {"question": "Explain the bias-variance tradeoff in machine learning.", "category": "Technical", "hint": "Bias is error from erroneous assumptions (underfitting). Variance is error from sensitivity to training fluctuations (overfitting). Optimize by balancing both."},
    {"question": "What is overfitting and how do you prevent it?", "category": "Technical", "hint": "Overfitting occurs when a model learns training data noise. Prevent it with cross-validation, regularization (L1/L2), pruning decision trees, or dropout layers."},
    {"question": "Compare L1 (Lasso) and L2 (Ridge) regularization.", "category": "Technical", "hint": "L1 adds absolute value penalty, causing weight sparsity (feature selection). L2 adds squared value penalty, keeping weights small but non-zero."},
    {"question": "Describe the assumptions of Linear Regression.", "category": "Technical", "hint": "Assumptions: Linearity, independence of errors, homoscedasticity (constant error variance), and normality of error distribution."},
    {"question": "Explain Logistic Regression. Why does it output probabilities?", "category": "Technical", "hint": "Logistic regression applies a sigmoid function $\\sigma(z) = 1/(1+e^{-z})$ to linear inputs, restricting outputs strictly between 0 and 1, representing probabilities."},
    {"question": "How do Decision Trees split nodes? Explain Entropy and Gini impurity.", "category": "Technical", "hint": "Splits aim to maximize information gain. Entropy measures disorder/uncertainty. Gini impurity measures the probability of misclassifying a random element."},
    {"question": "How does Random Forest create robust ensembles?", "category": "Technical", "hint": "Random Forest builds multiple decision trees using bootstrap aggregating (bagging) and random feature selection, averaging trees to reduce variance."},
    {"question": "Explain Support Vector Machines (SVM) and the kernel trick.", "category": "Technical", "hint": "SVM finds the hyperplane maximizing margins between classes. The kernel trick maps low-dimensional data into higher dimensions to resolve non-linear splits."},
    {"question": "Detail the K-Means clustering algorithm. How do you select 'K'?", "category": "Technical", "hint": "Assigns points to the nearest centroid, then updates centroids recursively. Select 'K' using the Elbow Method (within-cluster sum of squares) or Silhouette Score."},
    {"question": "Explain Principal Component Analysis (PCA) for dimensionality reduction.", "category": "Technical", "hint": "PCA is a linear transformation that identifies orthogonal axes (principal components) along which data variance is maximized, dropping low-variance axes."},
    {"question": "What is the difference between supervised and unsupervised learning?", "category": "Technical", "hint": "Supervised learning uses labeled datasets to train models (classification, regression). Unsupervised learning models patterns on unlabeled data (clustering, PCA)."},
    {"question": "Explain the concept of precision, recall, and F1-score.", "category": "Technical", "hint": "Precision: True Positives / (True + False Positives). Recall: True Positives / (True Positives + False Negatives). F1-score: Harmonic mean of precision and recall."},
    {"question": "What is ROC-AUC and when should you use it?", "category": "Technical", "hint": "ROC curves plot True Positive Rate against False Positive Rate. AUC measures overall classification sorting strength, robust to class imbalance."},
    {"question": "Explain Cross-Validation. Why is it preferred over simple train-test split?", "category": "Technical", "hint": "K-Fold splits data into K subsets, validating K times on unique test sets. It reduces evaluation variance and prevents overfitting assessments."},
    {"question": "Explain Mean Squared Error (MSE) vs Mean Absolute Error (MAE).", "category": "Technical", "hint": "MSE squares errors, heavily penalizing large outliers. MAE sums absolute values, penalizing errors linearly, making it more robust to outliers."},
    {"question": "Explain p-value and statistical significance.", "category": "Technical", "hint": "A p-value is the probability of observing results as extreme as the actual test under the null hypothesis. Results are significant if $p < 0.05$ (typically)."},
    {"question": "What is Type I error vs Type II error?", "category": "Technical", "hint": "Type I error is a False Positive (rejecting a true null hypothesis). Type II error is a False Negative (failing to reject a false null hypothesis)."},
    {"question": "State Bayes Theorem and explain its role in Naive Bayes classification.", "category": "Technical", "hint": "$P(A|B) = P(B|A)P(A)/P(B)$. Naive Bayes assumes independent features to compute posterior probabilities for classes given input data attributes."},
    {"question": "Explain the difference between covariance and correlation.", "category": "Technical", "hint": "Covariance measures the directional relationship between variables. Correlation scales covariance between -1 and +1 to measure strength and direction."},
    {"question": "How do you handle missing data in Pandas?", "category": "Project-Based", "hint": "Use `.isnull()`. Strategies include dropping rows (`.dropna()`), imputing with mean/median/mode (`.fillna()`), or using KNN/Iterative Imputation models."},
    {"question": "How do you identify outliers in a dataset?", "category": "Project-Based", "hint": "Use boxplots, the Interquartile Range (IQR) method (values outside $1.5 \\times IQR$ from quartiles), or Z-scores (values beyond $\\pm 3$ standard deviations)."},
    {"question": "Explain Gradient Descent. What are Batch, Mini-batch, and Stochastic variants?", "category": "Technical", "hint": "Optimizes weights by moving down the loss gradient. Batch uses all data per step. Stochastic uses one sample. Mini-batch uses a small subset."},
    {"question": "What is the role of activation functions in Neural Networks?", "category": "Technical", "hint": "Introduces non-linearities, allowing neural networks to learn complex mapping boundaries. Examples: Sigmoid (0 to 1), ReLU (outputs $\\max(0, x)$)."},
    {"question": "Explain the vanishing gradient problem. How do you resolve it?", "category": "Technical", "hint": "Gradients shrink exponentially during backpropagation in deep networks, stopping weight updates. Solve with ReLU activation, residual connections, or batch normalization."},
    {"question": "How do Convolutional Neural Networks (CNNs) work?", "category": "Technical", "hint": "CNNs extract spatial features from inputs (images) using shared kernels (filters) in convolutional layers, followed by pooling and fully-connected layers."},
    {"question": "What are Recurrent Neural Networks (RNNs) and LSTMs?", "category": "Technical", "hint": "RNNs process sequential data using internal loops. LSTMs (Long Short-Term Memory) introduce input, forget, and output gates to retain long-term patterns."},
    {"question": "Explain the Self-Attention mechanism in Transformers.", "category": "Technical", "hint": "Calculates correlation weights between all tokens in a sequence simultaneously using Query, Key, and Value vectors, enabling parallel context learning."},
    {"question": "What is TF-IDF? How is it calculated?", "category": "Technical", "hint": "Term Frequency-Inverse Document Frequency. TF measures term count in a document. IDF measures term uniqueness across all documents: $\\log(Total / DocCount(term))$."},
    {"question": "Explain Word Embeddings. Compare Word2Vec and BERT.", "category": "Technical", "hint": "Maps words to dense vector spaces. Word2Vec creates static vectors per word. BERT uses transformers to generate contextual vectors based on adjacent words."},
    {"question": "What is the difference between A/B testing and multivariate testing?", "category": "Technical", "hint": "A/B testing compares a control against one variant (A vs B). Multivariate testing compares changes to multiple features simultaneously to observe combinations."},
    {"question": "How do you build a machine learning model pipeline in Scikit-Learn?", "category": "Project-Based", "hint": "Use `Pipeline([('scaler', StandardScaler()), ('classifier', LogisticRegression())])`. It chains preprocessing steps and estimator evaluations securely."},
    {"question": "What is data leakage? How do you prevent it?", "category": "Technical", "hint": "Occurs when target information leaks from test/validation sets into training data. Prevent it by fitting scalers/transformers only on the training set."},
    {"question": "How do you handle highly imbalanced datasets in classification?", "category": "Project-Based", "hint": "Apply resampling (SMOTE oversampling, undersampling), adjust class weights in estimators, or use evaluation metrics like Precision-Recall AUC instead of accuracy."},
    {"question": "Explain bagging vs boosting ensemble paradigms.", "category": "Technical", "hint": "Bagging trains independent models in parallel and aggregates results (Random Forest). Boosting trains models sequentially, correcting previous mistakes (XGBoost)."},
    {"question": "Explain Support and Confidence in Association Rule Mining.", "category": "Technical", "hint": "Support is the frequency of an itemset in transactions. Confidence is the likelihood that item B is purchased given item A is purchased: $P(B|A)$."},
    {"question": "What is the difference between Normalization and Standardization?", "category": "Technical", "hint": "Normalization scales features to $[0, 1]$. Standardization centers features to mean 0 and standard deviation 1, which is less sensitive to outliers."},
    {"question": "Explain the Central Limit Theorem.", "category": "Technical", "hint": "States that the distribution of sample means approaches a normal distribution as the sample size becomes large ($N \\geq 30$), regardless of the population shape."},
    {"question": "How does Principal Component Analysis preserve variance?", "category": "Technical", "hint": "PCA projects data onto eigenvectors of the covariance matrix. The eigenvalues determine the amount of variance explained by each principal axis."},
    {"question": "Explain the difference between L1 and L2 loss functions.", "category": "Technical", "hint": "L1 loss (Least Absolute Deviations) calculates absolute differences. L2 loss (Least Squares) calculates squared differences, penalizing outliers heavily."},
    {"question": "What are hyperparameter optimization techniques?", "category": "Project-Based", "hint": "Methods to select model configurations: GridSearchCV (brute-force search), RandomizedSearchCV (random samples), and Bayesian Optimization (probabilistic modeling)."},
    {"question": "What is the elbow method in K-Means clustering?", "category": "Project-Based", "hint": "Plots K values against the Within-Cluster Sum of Squares (WCSS). The optimal K is selected at the 'elbow' point where the rate of WCSS decrease slows down."},
    {"question": "Explain Neural Network Batch Normalization.", "category": "Technical", "hint": "Normalizes activation outputs of a layer per mini-batch. It stabilizes training, allows higher learning rates, and acts as a minor regularizer."},
    {"question": "What is the difference between standard Gradient Descent and Adam Optimizer?", "category": "Technical", "hint": "Gradient Descent uses a constant learning rate. Adam (Adaptive Moment Estimation) computes adaptive rates per parameter using moving averages of first and second moments."},
    {"question": "Explain the difference between generative and discriminative algorithms.", "category": "Technical", "hint": "Generative algorithms model the joint probability $P(X, Y)$ (e.g. Naive Bayes). Discriminative algorithms model the conditional probability $P(Y|X)$ (e.g. SVM)."},
    {"question": "How do you evaluate a clustering model's performance without ground truth labels?", "category": "Project-Based", "hint": "Use internal evaluation metrics: Silhouette Coefficient (evaluates separation/cohesion) or Davies-Bouldin Index (evaluates cluster similarity)."},
    {"question": "What is RMSE? How does it differ from MAE?", "category": "Technical", "hint": "Root Mean Squared Error is the square root of MSE. Like MSE, it penalizes larger errors more severely than MAE, but maintains the same units as the target variable."},
    {"question": "Explain TF-IDF vectorization in NLP pipelines.", "category": "Project-Based", "hint": "Converts document text into numerical vectors. Apply a `TfidfVectorizer` to fit on training corpus, transform documents, and feed to a classifier model."},
    {"question": "Explain Transfer Learning in deep learning.", "category": "Technical", "hint": "A paradigm where a model trained on a large dataset (e.g., ImageNet) is reused as the starting point for a model on a different but related task, saving training time."},
    {"question": "What is a confusion matrix? Explain the terms TP, TN, FP, FN.", "category": "Technical", "hint": "A tabular layout of classification results. TP: Correctly predicted positive. TN: Correctly predicted negative. FP: False alarm. FN: Missed target."},
    {"question": "How does early stopping prevent overfitting in neural networks?", "category": "Project-Based", "hint": "Monitors loss on a validation set during training. If validation loss stops improving for a specified number of epochs, training terminates to save the best weights."}
]

# 3. DEVOPS_QUESTIONS (50 Items)
DEVOPS_QUESTIONS = [
    {"question": "What is CI/CD? Describe a robust automated deployment pipeline.", "category": "Technical", "hint": "Continuous Integration automatically builds/tests code. Continuous Deployment automates production rollouts. Pipeline steps: linting, unit tests, security scans, Docker builds, and deployment."},
    {"question": "Explain Kubernetes pods, deployments, and services.", "category": "Technical", "hint": "A Pod is the smallest deployable unit in K8s containing containers. A Deployment manages pod replication and updates. A Service exposes pods to network traffic."},
    {"question": "What is Infrastructure as Code (IaC)? Compare Terraform vs Ansible.", "category": "Technical", "hint": "IaC defines infrastructure in code. Terraform is declarative, managing provisioning (VPCs, instances). Ansible is procedural/declarative, managing configuration on servers."},
    {"question": "What is Blue-Green deployment vs Canary deployment?", "category": "Technical", "hint": "Blue-Green runs two identical environments, swapping traffic 100% when verified. Canary deploys updates to a small slice of users (e.g., 5% traffic) first to test stability."},
    {"question": "Explain multi-stage Docker builds and their benefits.", "category": "Technical", "hint": "Multi-stage builds use multiple `FROM` instructions. You compile code in early stages, and copy only the compiled binaries to a clean runtime stage, reducing final image sizes."},
    {"question": "What is Docker containerization? Compare a container vs virtual machine.", "category": "Technical", "hint": "Containers share the host OS kernel and are lightweight. Virtual Machines include a full guest OS, running on a hypervisor, consuming more memory and CPU resources."},
    {"question": "Explain the Kubernetes architecture control plane.", "category": "Technical", "hint": "The Control Plane manages the cluster. Elements: `kube-apiserver` (API entry), `etcd` (state store), `kube-scheduler` (assigns pods), and `kube-controller-manager` (runs loops)."},
    {"question": "What are Kubernetes ConfigMaps and Secrets?", "category": "Technical", "hint": "ConfigMaps store non-sensitive configuration data in key-value pairs. Secrets store sensitive configurations like passwords and tokens, obfuscated in base64."},
    {"question": "What is a Kubernetes Ingress Controller?", "category": "Technical", "hint": "An API object that manages external access to services in a cluster, providing HTTP/HTTPS routing, SSL termination, and name-based virtual hosting."},
    {"question": "What is a Helm Chart in Kubernetes?", "category": "Technical", "hint": "A package manager for Kubernetes. Helm charts bundle YAML manifests into single packages, allowing parameterized templates for consistent application deployments."},
    {"question": "How does Terraform manage state? What is state locking?", "category": "Technical", "hint": "Terraform records infrastructure state in `terraform.tfstate`. State locking (using DynamoDB/Consul) prevents concurrent runs from corrupting the state file."},
    {"question": "What are Terraform modules? Why are they used?", "category": "Project-Based", "hint": "Modules are reusable containers of Terraform configurations. They encapsulate infrastructure resources (like a standard VPC) to write DRY configurations."},
    {"question": "Explain the difference between Jenkins Declarative and Scripted pipelines.", "category": "Technical", "hint": "Declarative pipelines use strict, predefined sections and syntax, making them readable. Scripted pipelines use Groovy code directly, offering maximum scripting flexibility."},
    {"question": "How do GitHub Actions workflows trigger? Explain runners.", "category": "Technical", "hint": "Workflows trigger on git events (push, pull_request) defined in YAML files. Runners (GitHub-hosted or self-hosted) execute the workflow jobs inside clean environments."},
    {"question": "What is AWS VPC? Explain public subnets vs private subnets.", "category": "Technical", "hint": "Virtual Private Cloud is an isolated network. Public subnets route traffic through an Internet Gateway. Private subnets route outbound traffic via a NAT Gateway."},
    {"question": "What is AWS IAM? Explain User, Group, Role, and Policy.", "category": "Technical", "hint": "IAM manages access. Users are identities. Groups contain users. Roles are assumed by services/users temporarily. Policies are JSON documents declaring permissions."},
    {"question": "Explain Serverless computing. What are AWS Lambda cold starts?", "category": "Technical", "hint": "Runs code without provisioning servers. Cold starts occur when a Lambda is triggered after being idle, causing initialization latency while spinning up container resources."},
    {"question": "What is the difference between AWS EC2, ECS, and EKS?", "category": "Technical", "hint": "EC2 offers raw VMs. ECS is a proprietary AWS container orchestrator. EKS is managed Kubernetes, fully compatible with standard K8s tools."},
    {"question": "Explain standard Linux file permissions: `chmod 755` vs `chmod 644`.", "category": "Technical", "hint": "`755` grants read/write/execute to owner, and read/execute to group and others. `644` grants read/write to owner, and read-only to group and others."},
    {"question": "What is the difference between a process and a daemon in Linux?", "category": "Technical", "hint": "A process is a standard running program. A daemon is a background process running detached from any active terminal session, typically started at boot."},
    {"question": "How do you monitor system resource usage in Linux?", "category": "Project-Based", "hint": "Use CLI tools: `top`/`htop` for CPU/memory, `df -h` for disk utilization, `free -m` for RAM, and `iostat` for disk I/O performance monitoring."},
    {"question": "What is DNS? Explain A, CNAME, and MX records.", "category": "Technical", "hint": "Domain Name System resolves names to IPs. A records map domain to IPv4. CNAME records map alias to another domain. MX records specify mail servers."},
    {"question": "Compare TCP and UDP protocols.", "category": "Technical", "hint": "TCP is connection-oriented, reliable, guarantees packet ordering and delivery checks. UDP is connectionless, fast, but does not guarantee delivery/order."},
    {"question": "What is the role of a Load Balancer? Name three routing algorithms.", "category": "Technical", "hint": "Distributes network traffic across servers. Algorithms: Round Robin (cyclic), Least Connections (routes to least busy), and IP Hash (binds client IP)."},
    {"question": "Explain HTTP response status codes in the 2xx, 3xx, 4xx, and 5xx families.", "category": "Technical", "hint": "2xx: Success (200 OK). 3xx: Redirection (301 Moved). 4xx: Client Errors (404 Not Found, 401 Unauthorized). 5xx: Server Errors (500 Internal Error)."},
    {"question": "What is Git Rebase vs Git Merge?", "category": "Technical", "hint": "`git merge` combines branches creating a new merge commit, preserving historical timeline. `git rebase` rewrites commits on top of base branch for a linear log."},
    {"question": "How do you secure secrets in a Git repository?", "category": "Project-Based", "hint": "Never commit secrets. Reference them via environment variables and inject them during runtime using tools like HashiCorp Vault, AWS Secrets Manager, or git-crypt."},
    {"question": "Explain log aggregation in microservices. What is the ELK stack?", "category": "Technical", "hint": "Consolidates logs from multiple nodes. ELK: Elasticsearch (index/store logs), Logstash (process/ingest logs), and Kibana (visualize/query logs)."},
    {"question": "What is Prometheus and Grafana? How do they work together?", "category": "Technical", "hint": "Prometheus pulls and stores time-series metric data via HTTP endpoints. Grafana queries Prometheus data to render real-time, customizable monitoring dashboards."},
    {"question": "What is GitOps? Explain how tools like ArgoCD work.", "category": "Technical", "hint": "GitOps uses Git as the single source of truth for declarative infrastructure. ArgoCD monitors git configurations and auto-synchronizes live K8s cluster states to match."},
    {"question": "Explain Docker volume mounts vs bind mounts.", "category": "Technical", "hint": "Volumes are managed by Docker on the host storage, clean and portable. Bind mounts map any arbitrary host directory path directly into the container."},
    {"question": "What is a Kubernetes DaemonSet?", "category": "Technical", "hint": "Ensures that all (or some) nodes run a single copy of a pod. Used for running cluster storage daemons, log collection daemons, or monitoring agents on every node."},
    {"question": "Explain Terraform provisioners. Why are they discouraged?", "category": "Technical", "hint": "Provisioners execute scripts locally or on remote VMs during resource creation. Discouraged because they introduce external state dependencies; prefer packer/cloud-init."},
    {"question": "Explain the purpose of a reverse proxy. Compare Web Server vs Application Server.", "category": "Technical", "hint": "A reverse proxy (Nginx) sits in front of backend servers, handling routing, SSL, and caching. Web servers deliver static content; App servers execute dynamic business logic."},
    {"question": "What is the purpose of the `/etc/hosts` file in Linux?", "category": "Technical", "hint": "A local plain-text file that maps hostname strings directly to static IP addresses, bypassing DNS name server lookups locally for matching mappings."},
    {"question": "What is Git Cherry-Pick?", "category": "Technical", "hint": "A git command that applies the changes introduced by a specific existing commit from another branch onto the current working branch, creating a new commit."},
    {"question": "Explain Docker container resource limits (CPU/Memory).", "category": "Project-Based", "hint": "Configure resource limits using `--memory` and `--cpus` flags or YAML equivalents. Prevents a single misbehaving container from exhausting host resources."},
    {"question": "What is the difference between a shell command and a system call?", "category": "Technical", "hint": "A shell command is an executable application run by a command interpreter. A system call is a programmatic interface for applications to request host kernel actions."},
    {"question": "Explain Kubernetes liveness vs readiness probes.", "category": "Technical", "hint": "Liveness probes check if a pod needs restarting. Readiness probes check if a pod is ready to accept incoming network traffic. If failing, traffic is blocked."},
    {"question": "How do you configure auto-scaling in AWS or Kubernetes?", "category": "Project-Based", "hint": "In AWS, configure Auto Scaling Groups based on CloudWatch metrics. In K8s, deploy the Horizontal Pod Autoscaler (HPA) targeting CPU or custom metrics."},
    {"question": "What is a zombie process in Linux? How do you kill it?", "category": "Technical", "hint": "A completed process whose entry remains in the process table because the parent hasn't read its exit status. Kill the parent process to reap it; zombies can't be killed directly."},
    {"question": "Explain the concept of Immutable Infrastructure.", "category": "Technical", "hint": "Infrastructure that is replaced rather than updated in place. Deploy updates by building new VM images or containers, preventing configuration drift over time."},
    {"question": "What is a Kubernetes StatefulSet? When do you use it instead of a Deployment?", "category": "Technical", "hint": "Manages stateful applications. It guarantees stable, unique network identifiers and persistent storage mappings for pods, which is essential for databases and replica clusters."},
    {"question": "What is an AWS NAT Gateway? Why is it placed in a public subnet?", "category": "Technical", "hint": "Network Address Translation gateway. Placed in a public subnet with an Elastic IP to translate private subnet traffic into public IPs, enabling secure outbound web access."},
    {"question": "How do you set up log rotation in Linux?", "category": "Project-Based", "hint": "Configure files inside `/etc/logrotate.d/` specifying rotation intervals (daily/weekly), compression settings, and retention counts to prevent disk exhaustion."},
    {"question": "Explain the difference between rolling updates and recreate deployment strategies in Kubernetes.", "category": "Technical", "hint": "Rolling updates replace pods gradually, ensuring zero downtime. Recreate terminates all existing pods before starting new ones, causing temporary downtime."},
    {"question": "What is the purpose of Terraform state locking?", "category": "Technical", "hint": "Prevents concurrent execution of Terraform commands on the same workspace, which could cause state conflicts, file corruption, or duplicate resource provisionings."},
    {"question": "How do you diagnose slow disk I/O in a Linux virtual machine?", "category": "Project-Based", "hint": "Run `iotop` to identify the writing process, `iostat -xz 1` to check disk utilization percentages, and check logs in `/var/log/syslog` for disk controller errors."},
    {"question": "What is Docker network host mode?", "category": "Technical", "hint": "Bypasses Docker's virtual network isolation, mapping the container's ports directly to the host's network interfaces, maximizing performance but losing port isolations."},
    {"question": "Explain the role of a bastion host.", "category": "Technical", "hint": "A secure, hardened public-facing VM used as a single proxy gateway to SSH into private subnet servers, reducing the exposed attack surface of the cloud network."}
]

# 4. CYBER_QUESTIONS (50 Items)
CYBER_QUESTIONS = [
    {"question": "What is SQL Injection (SQLi) and how do you prevent it?", "category": "Technical", "hint": "SQLi occurs when input parameters are executed as database commands. Prevent it by using prepared statements (parameterized queries) or ORMs instead of raw string concats."},
    {"question": "Explain Cross-Site Scripting (XSS). Compare Stored, Reflected, and DOM-based types.", "category": "Technical", "hint": "XSS injects scripts into trusted websites. Stored saves malicious script in the database. Reflected returns script via URL requests. DOM-based alters client-side DOM directly."},
    {"question": "What is Cross-Site Request Forgery (CSRF)? How do you prevent it?", "category": "Technical", "hint": "CSRF forces authenticated users to run unauthorized actions. Prevent it using anti-CSRF tokens, SameSite cookie flags, and verifying origin/referer headers."},
    {"question": "How do you securely store passwords in a database?", "category": "Technical", "hint": "Never store plain text. Hash passwords using slow cryptographic algorithms (bcrypt, Argon2) combined with unique random salt values to prevent rainbow table attacks."},
    {"question": "Detail the steps in a standard SSL/TLS Handshake.", "category": "Technical", "hint": "1. Client Hello (supported suites), 2. Server Hello (certificate + key exchange), 3. Client verifies cert, 4. Key generation (Diffie-Hellman), 5. Session keys verified."},
    {"question": "Compare symmetric and asymmetric encryption.", "category": "Technical", "hint": "Symmetric encryption uses a single shared key for encryption and decryption (AES). Asymmetric encryption uses a public/private key pair (RSA)."},
    {"question": "Explain JWT structure. How do you prevent JWT manipulation attacks?", "category": "Technical", "hint": "JWT consists of Header, Payload, and Signature. Prevent manipulation by enforcing strong signature verification algorithms (e.g. HS256/RS256) on the server."},
    {"question": "What is OAuth 2.0? Explain the Authorization Code Grant Flow.", "category": "Technical", "hint": "An authorization framework. Auth Code Flow: 1. User redirects to authorization server, 2. User consents, 3. Code returned to client, 4. Client swaps code for Access Token."},
    {"question": "Explain the difference between Authentication and Authorization.", "category": "Technical", "hint": "Authentication verifies *who* a user is (credentials, OTP). Authorization determines *what* an authenticated user is allowed to do (roles, ACLs)."},
    {"question": "What is CORS (Cross-Origin Resource Sharing) from a security perspective?", "category": "Technical", "hint": "A browser security mechanism that blocks cross-origin requests by default. Improper wildcard settings (`Access-Control-Allow-Origin: *`) can leak sensitive data."},
    {"question": "What is Session Hijacking? Name two mitigation techniques.", "category": "Technical", "hint": "Stealing active session identifiers. Mitigations: Enforce HTTP-only and Secure cookie flags, implement session timeouts, and re-authenticate for sensitive actions."},
    {"question": "Explain the concept of Principle of Least Privilege (PoLP).", "category": "Technical", "hint": "A security practice of limiting access rights for users and programs to the absolute minimum necessary to complete authorized tasks, reducing attack vectors."},
    {"question": "What is a Web Application Firewall (WAF) and how does it differ from a network firewall?", "category": "Technical", "hint": "A WAF inspects traffic at Layer 7 (Application) to block web-specific attacks (SQLi, XSS). Network firewalls inspect Layer 3/4 headers (IPs, ports)."},
    {"question": "Explain the difference between hashing and encryption.", "category": "Technical", "hint": "Hashing is a one-way mathematical function that converts data to fixed-length strings (irreversible). Encryption is a two-way function that secures data but allows decryption via keys."},
    {"question": "What is Public Key Infrastructure (PKI)?", "category": "Technical", "hint": "A framework managing digital certificates and public-key cryptography, validating identities using trusted Certificate Authorities (CAs)."},
    {"question": "Explain Man-in-the-Middle (MITM) attacks. How does HTTPS prevent them?", "category": "Technical", "hint": "An attacker intercepts communications between two parties. HTTPS uses SSL/TLS certificates signed by trusted authorities to verify server identity, encrypting data to block snooping."},
    {"question": "What is SSRF (Server-Side Request Forgery)?", "category": "Technical", "hint": "An attack where the server is manipulated into making HTTP requests to arbitrary destinations (often internal metadata endpoints), leaking confidential data."},
    {"question": "Explain IDOR (Insecure Direct Object Reference).", "category": "Technical", "hint": "Occurs when an application exposes references to database objects (like keys or URLs) without checking if the requesting user is authorized to access those resources."},
    {"question": "What is Multi-Factor Authentication (MFA)? Why is SMS-based MFA discouraged?", "category": "Technical", "hint": "MFA requires multiple validation factors (knowledge, possession, inheritance). SMS MFA is discouraged due to SIM swapping and interception attacks; prefer authenticator apps."},
    {"question": "What is Salt in cryptography? Why is it added to hashes?", "category": "Technical", "hint": "A random string added to passwords before hashing. It ensures identical passwords produce unique hashes, neutralizing dictionary and pre-computed rainbow table attacks."},
    {"question": "How do you mitigate brute-force password attacks?", "category": "Project-Based", "hint": "Implement rate limiting, account lockout policies after consecutive failed attempts, CAPTCHAs on login forms, and enforce strong password policies."},
    {"question": "Explain secure headers: Content-Security-Policy (CSP) and Strict-Transport-Security (HSTS).", "category": "Technical", "hint": "CSP restricts resource loading sources to mitigate XSS. HSTS forces browsers to load the website exclusively over secure HTTPS connections."},
    {"question": "What is Penetration Testing? List its typical phases.", "category": "Technical", "hint": "Simulating real cyberattacks to find weaknesses. Phases: 1. Reconnaissance, 2. Scanning/Discovery, 3. Gaining Access, 4. Maintaining Access, 5. Analysis/Reporting."},
    {"question": "What is DNS Spoofing (Cache Poisoning)?", "category": "Technical", "hint": "Attackers inject corrupt DNS records into resolver caches, redirecting users to malicious websites. Prevent using DNSSEC (signed DNS records)."},
    {"question": "Explain the difference between a vulnerability scan and a penetration test.", "category": "Technical", "hint": "Vulnerability scans are automated checks to flag known issues. Penetration tests are active, manual engagements by experts to exploit and discover deep issues."},
    {"question": "What is a Zero-Day vulnerability?", "category": "Technical", "hint": "A software vulnerability that is discovered and exploited before the vendor is aware of it or has released a security patch to fix the issue."},
    {"question": "How do you implement secure file uploads in a web application?", "category": "Project-Based", "hint": "Validate file extensions and magic bytes, limit file size, rename files to random hashes, and store uploaded files outside the web root or in an isolated S3 bucket."},
    {"question": "Explain the difference between black-box, white-box, and gray-box penetration testing.", "category": "Technical", "hint": "Black-box: tester has no prior knowledge. White-box: tester has full access (source code, diagrams). Gray-box: tester has partial user credentials or configs."},
    {"question": "What is the OWASP Top 10 list?", "category": "Technical", "hint": "A standard awareness document representing the ten most critical security vulnerabilities for web applications, updated periodically by industry experts."},
    {"question": "Explain security risks associated with third-party dependencies.", "category": "Project-Based", "hint": "Malicious code injections or known exploits in library versions. Mitigate using dependency checkers (npm audit, Snyk) and locking specific dependency versions."},
    {"question": "What is the difference between asymmetric cryptography key pairs?", "category": "Technical", "hint": "The public key is shared widely and used to encrypt messages or verify signatures. The private key is kept secret and used to decrypt messages or sign documents."},
    {"question": "Explain the mechanism of a DDoS (Distributed Denial of Service) attack.", "category": "Technical", "hint": "Flooding server resources or networks using botnets (thousands of compromised devices), causing service exhaustion. Mitigate using CDN filtering or rate limiting."},
    {"question": "What is Social Engineering? Name three common tactics.", "category": "Technical", "hint": "Manipulating individuals to compromise confidentiality. Tactics: Phishing (fraudulent emails), Pretexting (invented scenario), and Baiting (tempting with bait)."},
    {"question": "Explain Buffer Overflow. How do modern operating systems mitigate it?", "category": "Technical", "hint": "Writing more data to a buffer than it can hold, overwriting memory. Mitigate using Address Space Layout Randomization (ASLR) and stack canaries."},
    {"question": "What is an Intrusion Detection System (IDS) vs Intrusion Prevention System (IPS)?", "category": "Technical", "hint": "An IDS monitors network traffic and alerts on suspicious activity. An IPS does the same but actively blocks or drops suspicious packets automatically."},
    {"question": "How does Salting differ from Pepper in cryptography?", "category": "Technical", "hint": "A Salt is stored alongside the password hash in the database. A Pepper is a secret key stored separately in configuration files, adding an extra layer of defense."},
    {"question": "Explain secure session token invalidation.", "category": "Project-Based", "hint": "On logout, immediately delete the token from the client, revoke it on the backend database/Redis blacklist, and set cookie expiration headers to the past."},
    {"question": "What is Directory Traversal (Path Traversal)? How do you prevent it?", "category": "Technical", "hint": "Exploiting input fields to read arbitrary host system files (e.g. `../../etc/passwd`). Prevent by sanitizing file paths and resolving absolute paths securely."},
    {"question": "Explain the purpose of rate limiting in API security.", "category": "Project-Based", "hint": "Restricts the number of API requests from an IP in an interval, protecting backend resources from DDoS, brute-force logins, and scraping scripts."},
    {"question": "What is an XML External Entity (XXE) injection?", "category": "Technical", "hint": "An attack targeting XML parsers, inserting external entity references that cause the server to read local files, execute internal requests, or scan network nodes."},
    {"question": "How do you implement end-to-end encryption (E2EE)?", "category": "Project-Based", "hint": "Encrypt data on the client using the recipient's public key before transmission, transmitting cipher text so that intermediate servers cannot read the content."},
    {"question": "Explain security audits in CI/CD pipelines (SAST vs DAST).", "category": "Technical", "hint": "SAST (Static Application Security Testing) analyzes source code for vulnerabilities without running it. DAST (Dynamic) tests active running applications externally."},
    {"question": "What is IP Spoofing?", "category": "Technical", "hint": "Creating IP packets with forged source IP addresses to impersonate trusted machines, bypassing IP-based access control rules."},
    {"question": "Explain the concept of Zero Trust network architecture.", "category": "Technical", "hint": "A security model that requires continuous verification of every device and user accessing resources, rejecting the perimeter-security model ('never trust, always verify')."},
    {"question": "What is phishing? How does it differ from spear-phishing?", "category": "Technical", "hint": "Phishing targets mass groups with generic lures. Spear-phishing targets specific individuals or organizations using researched personal details."},
    {"question": "How do you secure Docker containers in production?", "category": "Project-Based", "hint": "Run containers as non-root users, use minimal base images (Alpine), scan images for vulnerabilities, limit CPU/memory resources, and mount root filesystems as read-only."},
    {"question": "What is Port Scanning? How does it help security auditing?", "category": "Technical", "hint": "Probing open network ports on a host using tools like Nmap to determine active services, which helps map vulnerabilities and close unnecessary open entryways."},
    {"question": "Explain Cryptographic Salt reuse vulnerability.", "category": "Technical", "hint": "If the same Salt is reused across all users, an attacker can use a single pre-computed lookup table to decrypt identical hashes, bypassing the salt protection."},
    {"question": "What is a clickjacking attack? How do you prevent it?", "category": "Technical", "hint": "Tricking users into clicking invisible buttons embedded in iFrames. Prevent by using the `X-Frame-Options` or `Content-Security-Policy: frame-ancestors` headers."},
    {"question": "Explain Secure Boot concepts in device firmware security.", "category": "Technical", "hint": "A security standard verifying that a device's bootloader and operating system code are signed with cryptographic keys trusted by the system hardware."}
]

# 5. QA_QUESTIONS (50 Items)
QA_QUESTIONS = [
    {"question": "Explain the difference between Regression Testing and Retesting.", "category": "Technical", "hint": "Retesting verifies a specific bug is fixed by running the failed case. Regression testing runs the broader suite to ensure changes didn't break existing features."},
    {"question": "What is Equivalence Partitioning and Boundary Value Analysis?", "category": "Technical", "hint": "Equivalence Partitioning divides inputs into valid/invalid classes. Boundary Value Analysis tests values at class edges (e.g. 17, 18, 19 if min is 18)."},
    {"question": "Compare Smoke Testing vs Sanity Testing.", "category": "Technical", "hint": "Smoke testing verifies basic build stability (critical paths work). Sanity testing verifies specific modifications or bug fixes are stable before deeper tests."},
    {"question": "What is the Software Testing Life Cycle (STLC)? List its phases.", "category": "Technical", "hint": "1. Requirement Analysis, 2. Test Planning, 3. Test Case Development, 4. Environment Setup, 5. Test Execution, 6. Test Cycle Closure."},
    {"question": "What is the difference between a Bug, Defect, Error, and Failure?", "category": "Technical", "hint": "Error is a developer mistake. Bug/Defect is identified during testing. Failure is a bug encountered by end-users in production."},
    {"question": "What is the Page Object Model (POM) in test automation?", "category": "Technical", "hint": "A design pattern that encapsulates web pages/components in classes, separating locator selectors and action methods from the test script logic."},
    {"question": "How does Selenium WebDriver communicate with browsers?", "category": "Technical", "hint": "In Selenium 3, it used JSON Wire Protocol. In Selenium 4, it communicates directly via the W3C WebDriver Protocol, translating test commands to native browser actions."},
    {"question": "Compare Selenium and Playwright automation frameworks.", "category": "Technical", "hint": "Selenium supports older browsers and runs out-of-process. Playwright is modern, faster, auto-waits for elements, and communicates via Chrome DevTools Protocol (CDP)."},
    {"question": "What is auto-waiting in Playwright? Why is it useful?", "category": "Technical", "hint": "Playwright checks if elements are actionable (visible, stable, enabled) before performing clicks, reducing flaky test failures caused by timing issues."},
    {"question": "How do you handle dynamic element selectors in automation?", "category": "Project-Based", "hint": "Avoid absolute XPaths. Use stable attributes (e.g. `data-testid`), relative locating relationships, or regex dynamic attributes (`contains(@class, 'active')`)."},
    {"question": "What is API testing? List key HTTP response elements you assert.", "category": "Technical", "hint": "Testing REST/SOAP endpoints without UI. Key assertions: HTTP status code, headers (Content-Type), response body schema, and latency times."},
    {"question": "How do you set up parameterized tests in JUnit or PyTest?", "category": "Project-Based", "hint": "Use annotations/decorators (e.g., `@pytest.mark.parametrize` or `@ParameterizedTest`). Feed variable tuples to run the same test assertions over varying datasets."},
    {"question": "What is the difference between Unit, Integration, and System testing?", "category": "Technical", "hint": "Unit tests test single methods. Integration tests verify interactions between components. System testing validates the end-to-end product flow."},
    {"question": "Explain exploratory testing. When is it most effective?", "category": "Technical", "hint": "Manual hands-on testing where the tester designs and runs tests on the fly. Best when requirements are scarce or before major product releases."},
    {"question": "What is the difference between positive and negative testing?", "category": "Technical", "hint": "Positive testing verifies application behavior under valid inputs. Negative testing validates error-handling and resilience under invalid inputs/actions."},
    {"question": "Explain dynamic Waits in Selenium: Implicit vs Explicit vs Fluent.", "category": "Technical", "hint": "Implicit applies a global timeout. Explicit polls for specific element criteria. Fluent wait defines polling intervals and exceptions to ignore."},
    {"question": "How do you handle test data management in automation suites?", "category": "Project-Based", "hint": "Isolate test data from test scripts. Load data dynamically from JSON, CSV, or database queries, and clean up test data post-run."},
    {"question": "What is CI/CD test integration? When should you run automation tests?", "category": "Project-Based", "hint": "Trigger fast unit/smoke tests on code pushes (pull requests). Run heavy regression or integration suites overnight or before rollouts to protect environments."},
    {"question": "What is load testing vs stress testing?", "category": "Technical", "hint": "Load testing checks performance under expected concurrent user load. Stress testing tests upper capacity limits until the system crashes/breaks."},
    {"question": "Explain Bug Severity vs Priority. Provide an example.", "category": "Technical", "hint": "Severity is technical impact. Priority is business urgency. Example: A typo on the homepage has low severity but high priority for branding."},
    {"question": "What is black-box vs white-box testing?", "category": "Technical", "hint": "Black-box tests software interfaces without knowing inner code structures. White-box tests internal algorithms, paths, and branch coverages."},
    {"question": "How do you automate API tests using RestAssured?", "category": "Project-Based", "hint": "Chain methods declarative: `given().contentType(JSON).body(payload).when().post(\"/api\").then().statusCode(201).body(\"status\", equalTo(\"success\"));`."},
    {"question": "What is test coverage vs code coverage?", "category": "Technical", "hint": "Code coverage measures code lines executed by unit tests (tool metrics). Test coverage measures the percentage of user requirements covered by tests."},
    {"question": "Explain mock dependencies in testing. Stub vs Mock.", "category": "Technical", "hint": "Stubs return predefined hardcoded data. Mocks verify calls, tracking invocations, parameter signatures, and frequencies for assertions."},
    {"question": "What is the bug life cycle? Name its primary states.", "category": "Technical", "hint": "New -> Assigned -> Open -> Fixed -> Retest -> Reopen (if fails) -> Verified -> Closed."},
    {"question": "What is the difference between static and dynamic testing?", "category": "Technical", "hint": "Static testing reviews requirements, designs, and code without execution. Dynamic testing runs the compiled application to assert behaviors."},
    {"question": "Explain non-functional testing. Give three examples.", "category": "Technical", "hint": "Validates system attributes. Examples: Performance/load times, security vulnerabilities, and accessibility compliance (WCAG)."},
    {"question": "How do you automate testing of alerts, popups, and multiple browser tabs?", "category": "Project-Based", "hint": "In Selenium, use driver switch commands: `driver.switchTo().alert().accept()` or `driver.switchTo().window(handle)`. In Playwright, utilize page listener promises."},
    {"question": "What is shift-left testing? Why is it beneficial?", "category": "Technical", "hint": "Integrating testing earlier in the software development lifecycle (e.g. at the design phase). It reduces fixing costs since bugs are caught early."},
    {"question": "How do you generate automated HTML test reports in your frameworks?", "category": "Project-Based", "hint": "Integrate reporting plugins like Allure Reports or ExtentReports to automatically compile test run charts, execution logs, and failure screenshots."},
    {"question": "What is a flaky test? How do you prevent flakiness in automation?", "category": "Project-Based", "hint": "A test that passes and fails intermittently without code changes. Prevent by replacing hardcoded sleep times with dynamic waits and isolating test states."},
    {"question": "Explain mutations testing.", "category": "Technical", "hint": "Modifying small lines of source code (injecting bugs) to check if your existing unit test suite flags the changes. If not, tests are weak."},
    {"question": "What is data-driven testing? Why is it useful?", "category": "Technical", "hint": "Running a test scenario repeatedly with different inputs fed from spreadsheets/databases, checking bounds and valid partitions efficiently."},
    {"question": "What is accessibility testing? Name a tool used for automation.", "category": "Technical", "hint": "Ensures software is usable by people with disabilities. Automate using tools like Axe-core integrated into Selenium/Playwright scripts."},
    {"question": "Explain the concept of Test-Driven Development (TDD).", "category": "Technical", "hint": "A development methodology where you write the failing unit test first, implement the minimum code to pass, and then refactor the code."},
    {"question": "What is Behavior-Driven Development (BDD)? Compare with TDD.", "category": "Technical", "hint": "BDD focuses on user behavior, writing test scenarios in plain English (Gherkin syntax: Given/When/Then) to align developers, QA, and business analysts."},
    {"question": "Explain Gherkin syntax rules.", "category": "Technical", "hint": "Uses keywords to structure scenarios: `Feature` (describes target), `Scenario` (use case), `Given` (precondition), `When` (action), and `Then` (expected result)."},
    {"question": "How do you automate testing of web tables or grids?", "category": "Project-Based", "hint": "Locate the table element, iterate over row elements (`<tr>`), fetch column cells (`<td>`), and assert text contents or run actions matching columns."},
    {"question": "What is the difference between validation and verification?", "category": "Technical", "hint": "Verification checks if the product meets design specifications ('Did we build it right?'). Validation checks if it meets user needs ('Did we build the right thing?')."},
    {"question": "How do you automate testing for drag-and-drop or hover actions?", "category": "Project-Based", "hint": "In Selenium, use the `Actions` class: `actions.moveToElement(el).perform()` or `actions.dragAndDrop(src, target).perform()`. Playwright has a native `.hover()` and `.dragTo()` method."},
    {"question": "What is cross-browser testing? How do you scale it?", "category": "Project-Based", "hint": "Verifying site behavior across Chrome, Safari, Firefox, and Edge. Scale it using cloud grids like BrowserStack, SauceLabs, or Selenium Grid containers."},
    {"question": "Explain the testing pyramid concept.", "category": "Technical", "hint": "A testing guideline suggesting a high volume of fast unit tests at the base, a moderate volume of API/integration tests in the middle, and few end-to-end UI tests on top."},
    {"question": "How do you handle shadow DOM elements in test automation?", "category": "Project-Based", "hint": "Playwright pierces shadow DOMs by default. In Selenium, execute javascript queries: `return document.querySelector('#host').shadowRoot.querySelector('#target')`."},
    {"question": "What is dynamic security testing in QA workflows?", "category": "Technical", "hint": "Integrating automated vulnerability scanners (like OWASP ZAP) into QA test pipelines to scan web forms and APIs for security flaws during execution."},
    {"question": "Explain visual regression testing.", "category": "Technical", "hint": "Captures screenshots of pages and compares them pixel-by-pixel against approved baseline screenshots to flag unintended layout or styling shifts."},
    {"question": "How do you test network latency simulations in Playwright?", "category": "Project-Based", "hint": "Use Playwright's `browserContext.newCDPSession(page)` to set network throttling (offline state, download/upload throughput limits, latency delays)."},
    {"question": "What is the purpose of test estimation in agile sprint planning?", "category": "Project-Based", "hint": "Determines QA resource requirements and story complexity points based on testing needs, test case writing, setup, and manual validation times."},
    {"question": "How do you automate OAuth2 login flows in test suites?", "category": "Project-Based", "hint": "Avoid UI login flows for third parties. Fetch OAuth tokens programmatically via API HTTP requests, inject the token payload into browser session storage, and load pages directly."},
    {"question": "What is recovery testing?", "category": "Technical", "hint": "Forcing software to fail (e.g. killing server processes, disconnecting databases) to verify that recovery mechanisms resume operations securely without data loss."},
    {"question": "Explain the difference between alpha and beta testing.", "category": "Technical", "hint": "Alpha testing is performed by internal QA/developers in-house. Beta testing is performed by a small cohort of real customers in external staging environments."}
]

# 6. MOBILE_QUESTIONS (50 Items)
MOBILE_QUESTIONS = [
    {"question": "Detail the Android Activity Lifecycle.", "category": "Technical", "hint": "An activity transitions through: `onCreate()` (init), `onStart()` (visible), `onResume()` (interactive), `onPause()` (partially visible), `onStop()` (hidden), and `onDestroy()` (destroyed)."},
    {"question": "Detail the iOS UIViewController Lifecycle.", "category": "Technical", "hint": "Transition phases: `viewDidLoad()` (view loaded in memory), `viewWillAppear()`, `viewDidAppear()` (visible in window), `viewWillDisappear()`, and `viewDidDisappear()`."},
    {"question": "What is Automatic Reference Counting (ARC) in Swift?", "category": "Technical", "hint": "iOS memory manager. It tracks object references, deallocating memory when reference counts hit zero. Strong reference cycles cause memory leaks; resolve using `weak` or `unowned` declarations."},
    {"question": "Explain Kotlin Coroutines and Flows on Android.", "category": "Technical", "hint": "Coroutines allow lightweight, non-blocking asynchronous programming on Android (e.g. on Dispatchers.IO). Flows stream data asynchronously from database/networks to UI."},
    {"question": "Compare React Native and Flutter architectures.", "category": "Technical", "hint": "React Native communicates with native APIs via a JS bridge or JSI (JavaScript Interface). Flutter compiles directly to machine code using Dart, rendering layouts natively via Skia/Impeller."},
    {"question": "What is the difference between a Stateless and Stateful widget in Flutter?", "category": "Technical", "hint": "Stateless widgets are immutable; their appearance depends solely on configuration parameters. Stateful widgets maintain dynamic mutable states that trigger UI updates on `setState()`."},
    {"question": "How do you handle background tasks in iOS?", "category": "Project-Based", "hint": "Register background tasks using the `BGTaskScheduler` framework. Perform lightweight data updates or sync tasks within designated run intervals permitted by iOS."},
    {"question": "How do you secure mobile app data storage?", "category": "Project-Based", "hint": "Do not write secrets to local databases/SharedPreferences. In Android, use EncryptedSharedPreferences. In iOS, store tokens in the Secure Keychain."},
    {"question": "What is SSL Pinning in mobile security? Why is it used?", "category": "Technical", "hint": "Hardcoding the server's certificate public key inside the mobile client. It prevents Man-in-the-Middle (MITM) interceptor attacks by verifying matching certificates."},
    {"question": "Explain Android Intents. Difference between Explicit and Implicit.", "category": "Technical", "hint": "Intents navigate components. Explicit Intents target a specific class (e.g. `SecondActivity`). Implicit Intents declare an action (e.g. opening a web link) and let the OS resolve matches."},
    {"question": "What is dependency injection on Android? Explain Hilt.", "category": "Technical", "hint": "Hilt simplifies dependency injection on Android by providing predefined lifecycles and annotations (like `@AndroidEntryPoint`, `@Inject`) to manage container scopes."},
    {"question": "Explain the concept of declarative UI in Jetpack Compose vs traditional layouts.", "category": "Technical", "hint": "Traditional layouts use XML files parsed at runtime. Jetpack Compose uses Kotlin functions to describe UI states, updating layouts reactively on data changes."},
    {"question": "What is deep linking? How is it configured in mobile apps?", "category": "Project-Based", "hint": "URLs that route directly to specific app content. Configure via intent-filters in `AndroidManifest.xml` (Android) or URL Types / Associated Domains in `Info.plist` (iOS)."},
    {"question": "Explain push notifications architecture. Compare FCM and APNs.", "category": "Technical", "hint": "Backend triggers payloads. Firebase Cloud Messaging (FCM) coordinates notifications for Android (and optionally iOS). Apple Push Notification service (APNs) handles iOS delivery."},
    {"question": "How do you diagnose and fix memory leaks in Android apps?", "category": "Project-Based", "hint": "Profile heap allocations using Android Studio Profiler or integrate LeakCanary. Common cause: static variables holding context references; fix by clearing listeners on destroy."},
    {"question": "What is Swift's Grand Central Dispatch (GCD)?", "category": "Technical", "hint": "A low-level API managing concurrent operations. Dispatches tasks to queues: Main queue (handles UI rendering) and Global queues (handles background I/O or computations)."},
    {"question": "Explain Android's Room persistence library.", "category": "Technical", "hint": "An abstraction layer over SQLite. It provides compile-time query verification and integrates with LiveData/Flows to update UI components when database records change."},
    {"question": "What is Swift UI's `@State`, `@Binding`, and `@StateObject`?", "category": "Technical", "hint": "`@State` manages local view-owned state. `@Binding` passes read/write access to parent state. `@StateObject` manages lifecycle-persistent reference types."},
    {"question": "Explain how React Native's JSI (JavaScript Interface) improves performance.", "category": "Technical", "hint": "JSI replaces the old asynchronous bridge, allowing JavaScript code to invoke native C++ methods directly and synchronously, accelerating layout renders and integrations."},
    {"question": "How do you support offline functionality in mobile applications?", "category": "Project-Based", "hint": "Implement an offline-first sync pattern. Store API responses in a local database (Room/CoreData), load UI from the DB, and queue writes in sync queues to execute when online."},
    {"question": "What is the difference between Android Service and BroadcastReceiver?", "category": "Technical", "hint": "A Service runs long-running background tasks without UI. A BroadcastReceiver registers to listen and respond to system-wide events (like battery low)."},
    {"question": "What are iOS App Extensions?", "category": "Technical", "hint": "Feature bundles that let apps run tasks outside the main app container, such as custom keyboards, widget cards, or share sheet shortcuts."},
    {"question": "Explain how to handle app crashes and report diagnostics in production.", "category": "Project-Based", "hint": "Integrate Firebase Crashlytics or Sentry SDK. Upload mapping/dSYM files to symbolicate stack traces, allowing developers to locate code lines triggering failures."},
    {"question": "Compare CocoaPods, Carthage, and Swift Package Manager (SPM).", "category": "Technical", "hint": "CocoaPods is a centralized dependency manager using a Podfile. Carthage compiles frameworks without modifying projects. SPM is Apple's native dependency system integrated directly into Xcode."},
    {"question": "What is Android's ProGuard/R8 tool?", "category": "Technical", "hint": "Shrinks, obfuscates, and optimizes compiled bytecode. It reduces the final APK size and makes reverse-engineering the codebase significantly harder."},
    {"question": "Explain iOS App Store provisioning profiles and certificates.", "category": "Technical", "hint": "Certificates verify developer identity. Provisioning profiles bundle certificates, App IDs, and device lists to permit app installation on real iOS hardware."},
    {"question": "How do you optimize mobile application launch times?", "category": "Project-Based", "hint": "De-initialize third-party SDKs lazily, avoid heavy disk I/O on the main thread during boot, use splash screens, and optimize database read operations."},
    {"question": "What are React Native custom native modules?", "category": "Project-Based", "hint": "Custom Swift/Java classes written to expose native platform APIs (not covered by React Native core) to JavaScript code using bridge decorators."},
    {"question": "Explain the difference between Android's MVC, MVP, and MVVM architectures.", "category": "Technical", "hint": "MVC binds controller to activity. MVP uses a presenter to handle UI logic via contracts. MVVM uses ViewModels and Data Binding to separate layouts from logic."},
    {"question": "What is Flutter's state management? Compare Provider vs BLoC.", "category": "Technical", "hint": "Provider is simple, wrapping InheritedWidgets. BLoC (Business Logic Component) uses streams to enforce unidirectional data flow, separating UI from state events."},
    {"question": "How do you request runtime permissions in Android?", "category": "Project-Based", "hint": "Declare permissions in `AndroidManifest.xml`. Check permissions at runtime using `ContextCompat.checkSelfPermission` and request permission dialogs if ungranted."},
    {"question": "Explain iOS Safe Area layouts.", "category": "Technical", "hint": "A layout guide that defines the visible margins of a view, preventing UI elements from being clipped by physical device corners, notches, or home indicators."},
    {"question": "What is Android's WorkManager? When do you use it?", "category": "Technical", "hint": "A library for scheduling deferrable, guaranteed background work. It handles OS constraints (e.g. waits for Wi-Fi or charging) and executes tasks even if the app closes."},
    {"question": "Explain the difference between strong, weak, and unowned references in Swift.", "category": "Technical", "hint": "Strong keeps the instance in memory. Weak doesn't prevent deallocation and is optional. Unowned assumes the instance is never nil, avoiding optionals but risking crashes if accessed post-deallocation."},
    {"question": "What is the purpose of iOS Info.plist file?", "category": "Technical", "hint": "An information property list file configuring application metadata, bundle identifiers, and declaring user privacy permission keys (like camera access)."},
    {"question": "How do you implement image caching in mobile applications?", "category": "Project-Based", "hint": "Use libraries (Glide/Coil on Android, Kingfisher on iOS, FastImage on React Native) to automatically cache downloaded images in disk/memory and handle loading skeletons."},
    {"question": "What is Android's ViewBinding? Compare with DataBinding.", "category": "Technical", "hint": "ViewBinding creates references to layout views directly, replacing `findViewById`. DataBinding goes further, binding data properties directly inside layout XML files."},
    {"question": "Explain the role of Gradle in Android build automation.", "category": "Technical", "hint": "An open-source build tool that automates compiling resources, resolving external dependencies, running unit tests, and packaging binaries into APK/AAB files."},
    {"question": "What is iOS CoreData? Is it a database?", "category": "Technical", "hint": "An object-graph management framework. It can use SQLite as its underlying storage engine, but behaves as an in-memory data store with object-mapping capabilities."},
    {"question": "Explain the difference between Apple's UIKit and SwiftUI.", "category": "Technical", "hint": "UIKit is an imperative, event-driven framework using view hierarchies and constraints. SwiftUI is a modern, declarative framework using Swift code structures to describe state rendering."},
    {"question": "How do you handle multiple screen size resolutions in Flutter?", "category": "Project-Based", "hint": "Avoid hardcoded layouts. Use `LayoutBuilder`, `MediaQuery` dimensions, and flexible widgets (Expanded, Flexible, GridView) to adapt UI scaling reactively."},
    {"question": "What is the Android App Bundle (AAB)?", "category": "Technical", "hint": "A publishing format on Google Play. Google uses the bundle to compile and serve optimized APKs tailored to each device's language and density configuration."},
    {"question": "Explain iOS App sandboxing security constraints.", "category": "Technical", "hint": "An OS security policy limiting app access to isolated directory containers, preventing apps from accessing other application data or running direct system adjustments."},
    {"question": "What are React Native hermes engine benefits?", "category": "Technical", "hint": "An open-source JavaScript engine optimized for running React Native. It reduces app startup latency, cuts memory consumption, and shrinks final build sizes."},
    {"question": "How do you handle keyboard visibility clipping UI elements on mobile screens?", "category": "Project-Based", "hint": "Use layout adjustments: `WindowInsets` on Android, `KeyboardAvoidingView` on React Native, or wrapping layouts in scroll views that shift inputs automatically."},
    {"question": "What is the difference between Android's serializable and parcelable interfaces?", "category": "Technical", "hint": "Serializable is a standard Java reflection-based interface (slow). Parcelable is an Android-optimized serialization interface (faster, requires explicit implementation)."},
    {"question": "Explain Swift's async/await concurrency system.", "category": "Technical", "hint": "Introduces structured concurrency in Swift. It allows asynchronous tasks to look synchronous, using task hierarchies and clean error handling without nested closures."},
    {"question": "What is the role of iOS Keychain services?", "category": "Technical", "hint": "A secure storage container providing encrypted hardware storage for sensitive credentials like passwords, cryptographic keys, and authorization tokens."},
    {"question": "Explain the purpose of the Android launchMode attribute.", "category": "Technical", "hint": "Configures how an Activity behaves on navigation: `standard` (always creates new instances), `singleTop` (reuses if on top), `singleTask`, and `singleInstance`."},
    {"question": "How do you verify mobile application performance in automated pipelines?", "category": "Project-Based", "hint": "Run performance tests using Firebase Test Lab, integrate profiling tools that track CPU frames/second, memory usage, and report latencies during automated runs."}
]

# 7. JAVA_QUESTIONS (50 Items)
JAVA_QUESTIONS = [
    {"question": "Detail the JVM Memory Model. Explain Heap vs Stack vs Metaspace.", "category": "Technical", "hint": "Heap stores all object instances and is shared among threads. Stack stores local primitive variables and method call frames per thread. Metaspace stores class metadata in native memory."},
    {"question": "How does Java's Garbage Collection work? Compare G1 and ZGC.", "category": "Technical", "hint": "GC identifies unreachable heap objects to clean memory. G1 splits the heap into regions, collecting regions with the most garbage first. ZGC is a low-latency collector processing concurrently."},
    {"question": "Explain Java's Classloader mechanism.", "category": "Technical", "hint": "Loads class bytecode files into JVM memory. It uses delegation: Bootstrap (core runtime) -> Extension -> Application classloader, avoiding duplicate loading."},
    {"question": "What is the Reflection API in Java? When is it used?", "category": "Technical", "hint": "Allows inspecting and modifying classes, methods, and fields at runtime, bypassing access controls. Used extensively by frameworks like Spring and JUnit."},
    {"question": "Explain volatile vs synchronized variables/methods in Java multithreading.", "category": "Technical", "hint": "`volatile` guarantees visibility of variable updates across threads, preventing local caching. `synchronized` guarantees both visibility and mutual exclusion (locks)."},
    {"question": "Detail the Java ExecutorService and ThreadPoolExecutor configurations.", "category": "Technical", "hint": "`ThreadPoolExecutor` creates a pool of threads. Key parameters: corePoolSize, maximumPoolSize, keepAliveTime, and workQueue (e.g., ArrayBlockingQueue)."},
    {"question": "What is CompletableFuture? How do you chain asynchronous tasks?", "category": "Technical", "hint": "A class supporting non-blocking async operations. Chain tasks using methods like `thenApply` (maps result), `thenAccept`, and `exceptionally` for errors."},
    {"question": "Explain Java 8 Streams API. How do parallel streams operate?", "category": "Technical", "hint": "Streams process data declaratively. Parallel streams split operations across threads using the common `ForkJoinPool`, but carry overhead for small datasets."},
    {"question": "Explain type erasure in Java Generics.", "category": "Technical", "hint": "Generics enforce type checks at compile-time. The compiler replaces generic parameters with raw types (e.g. `Object`) during compilation, preventing runtime type logs."},
    {"question": "What is the difference between Checked and Unchecked exceptions in Java?", "category": "Technical", "hint": "Checked exceptions (derive from `Exception`) must be handled/declared at compile-time. Unchecked exceptions (derive from `RuntimeException`) occur at runtime."},
    {"question": "How do you construct custom exceptions in Java?", "category": "Project-Based", "hint": "Extend `Exception` (for checked exceptions) or `RuntimeException` (for unchecked). Provide constructors matching message string parameters and super calls."},
    {"question": "Explain Spring IoC container and Dependency Injection.", "category": "Technical", "hint": "Spring manages object instantiation (Beans) inside the Inversion of Control container. Dependency Injection resolves and wire Beans using `@Autowired` annotations."},
    {"question": "What is a Spring Bean lifecycle?", "category": "Technical", "hint": "Instantiation -> Populate Properties -> Aware interfaces -> BeanPostProcessor pre-init -> `@PostConstruct` -> InitializingBean -> Custom Init -> Ready -> `@PreDestroy` -> Destroy."},
    {"question": "Explain Bean scopes in Spring Framework.", "category": "Technical", "hint": "Scopes: 1. `singleton` (one instance per container), 2. `prototype` (new instance per request), 3. `request`, 4. `session` (for web applications)."},
    {"question": "What is Spring AOP? Explain Aspect, JoinPoint, and Advice.", "category": "Technical", "hint": "Aspect-Oriented Programming separates cross-cutting concerns (logging, transactions). Aspect is the module. JoinPoint is the execution point. Advice is the action taken."},
    {"question": "How does Spring Boot auto-configuration work?", "category": "Technical", "hint": "Scans classpath dependencies. If libraries (like database drivers) are present, it auto-instantiates configurations using `@EnableAutoConfiguration` and `@Conditional` annotations."},
    {"question": "How do you resolve the N+1 query problem in Spring Data JPA?", "category": "Project-Based", "hint": "Occurs when loading parent records triggers N individual queries for child records. Resolve using `@EntityGraph` annotations or writing JPQL JOIN FETCH queries."},
    {"question": "Explain FetchType: Eager vs Lazy in Hibernate.", "category": "Technical", "hint": "Eager fetches relationship records immediately with the parent query. Lazy loads child records only when accessed, requiring an active transaction session."},
    {"question": "Explain transaction propagation in Spring Boot.", "category": "Technical", "hint": "Configures how transactions behave in nested calls: `REQUIRED` (joins existing or creates new), `REQUIRES_NEW` (creates new, suspends current), `MANDATORY`."},
    {"question": "What is Spring Boot Actuator? Why is it used?", "category": "Project-Based", "hint": "Provides production-ready HTTP endpoints (e.g., `/actuator/health`, `/actuator/metrics`) to monitor application state and configuration details."},
    {"question": "Explain the difference between authentication and authorization in Spring Security.", "category": "Technical", "hint": "Authentication verifies credentials (using `AuthenticationProvider`). Authorization checks permissions and roles (using `@PreAuthorize` or filters)."},
    {"question": "How do you implement JWT authentication in Spring Boot?", "category": "Project-Based", "hint": "Create a security filter that intercepts HTTP requests, extracts the JWT header, validates the signature, and sets the auth context in `SecurityContextHolder`."},
    {"question": "Explain Microservice Design Patterns: API Gateway and Service Discovery.", "category": "Technical", "hint": "API Gateway routes client traffic to services. Service Discovery (Eureka) maps service IDs to transient IP locations, enabling dynamic routing."},
    {"question": "Explain the Circuit Breaker pattern. What is Resilience4j?", "category": "Technical", "hint": "Prevents cascading failures. If a service call fails repeatedly, the circuit opens, immediately returning fallback results instead of waiting for timeouts."},
    {"question": "What is Java's String Pool? How does it optimize memory?", "category": "Technical", "hint": "A pool of string literals in heap memory. Reuses identical literals to save space, but new instances created via `new String()` bypass the pool."},
    {"question": "What is the difference between `equals()` and `hashCode()` in Java?", "category": "Technical", "hint": "`equals()` compares values. `hashCode()` returns an integer hash. If two objects are equal via `equals()`, they MUST return the same `hashCode()`."},
    {"question": "Explain the difference between `Comparable` and `Comparator` interfaces.", "category": "Technical", "hint": "`Comparable` defines natural sorting inside the class via `compareTo()`. `Comparator` is an external class defining custom sorting via `compare()`."},
    {"question": "What is a Java ThreadLocal? When is it used?", "category": "Technical", "hint": "Provides thread-confined variables. Each thread has its own isolated copy, useful for storing transaction contexts or database connection states."},
    {"question": "Explain the differences between `HashMap`, `LinkedHashMap`, and `TreeMap`.", "category": "Technical", "hint": "`HashMap` offers $O(1)$ access but no ordering. `LinkedHashMap` maintains insertion order. `TreeMap` sorts keys naturally ($O(\\log N)$ access)."},
    {"question": "What is Java serialization? How do you prevent fields from being serialized?", "category": "Technical", "hint": "Converts object state into byte streams. Mark fields with the `transient` keyword to prevent them from being serialized (like passwords)."},
    {"question": "Explain the Java ForkJoinPool framework.", "category": "Technical", "hint": "A thread pool designed for divide-and-conquer tasks. It uses a work-stealing algorithm, letting idle threads steal tasks from busy queues."},
    {"question": "What are default and static methods in Java 8 interfaces?", "category": "Technical", "hint": "Default methods allow adding interface actions without breaking implementing classes. Static methods provide utility actions bound directly to interfaces."},
    {"question": "Explain Spring Boot's `@RestController` vs `@Controller`.", "category": "Technical", "hint": "`@Controller` returns web views (HTML/templates). `@RestController` combines `@Controller` and `@ResponseBody`, converting response objects to JSON automatically."},
    {"question": "What is JPA? How does it differ from Hibernate?", "category": "Technical", "hint": "JPA (Java Persistence API) is a specification/interface defining ORM guidelines. Hibernate is the actual framework implementation implementing JPA."},
    {"question": "Explain the Hibernate first-level cache vs second-level cache.", "category": "Technical", "hint": "First-level cache is session-scoped and active by default. Second-level cache is session-factory scoped, shared across all sessions, and requires configuration."},
    {"question": "How do you handle pagination and sorting in Spring Data JPA?", "category": "Project-Based", "hint": "Pass a `Pageable` parameter (e.g. `PageRequest.of(page, size, Sort.by(field))`) to repository queries, which return `Page<T>` wrapper objects."},
    {"question": "Explain Spring Security's CSRF protection.", "category": "Technical", "hint": "Spring Security generates anti-CSRF tokens for unsafe state-changing requests (POST/PUT). The client must include the token in headers to pass validation."},
    {"question": "What is a Spring Boot Starter dependency?", "category": "Technical", "hint": "A descriptors bundle that aggregates common dependencies under single POM configurations (e.g., `spring-boot-starter-web` holds Tomcat and Spring MVC)."},
    {"question": "Explain the role of Spring Boot configuration files: application.properties vs application.yml.", "category": "Technical", "hint": "Both configure settings. Properties files use flat dot-notation. YAML files use hierarchical structures, which are easier to read for nested configs."},
    {"question": "How do you handle database migrations in Java applications?", "category": "Project-Based", "hint": "Integrate migration tools like Flyway or Liquibase. They execute versioned SQL scripts automatically on application boot to update tables safely."},
    {"question": "What is the Java Module System (Project Jigsaw) in Java 9+?", "category": "Technical", "hint": "Introduces modules defining explicit dependency boundaries and encapsulation rules (via `module-info.java`), reducing runtime image sizes."},
    {"question": "Explain optimistic vs pessimistic locking in JPA.", "category": "Technical", "hint": "Optimistic locking uses version fields (`@Version`), checking mismatch on write. Pessimistic locking locks the database record directly (`SELECT ... FOR UPDATE`)."},
    {"question": "What is the difference between `Collection` and `Collections` in Java?", "category": "Technical", "hint": "`Collection` is a root interface for lists/sets. `Collections` is an utility class providing helper methods (sort, reverse) over collections."},
    {"question": "Explain the try-with-resources statement in Java.", "category": "Technical", "hint": "Automatically closes resources implementing `AutoCloseable` (like file streams) at block completion, replacing explicit `finally` cleanup logic."},
    {"question": "What is a Java record? Why is it useful?", "category": "Technical", "hint": "Introduced in Java 14, a record is a special class structure designed to hold immutable data. It automatically generates getters, `equals()`, `hashCode()`, and `toString()`."},
    {"question": "Explain Java's dynamic proxy mechanism.", "category": "Technical", "hint": "Allows creating proxy instances of interfaces at runtime via `Proxy.newProxyInstance()`, intercepting method calls to apply custom advices (like AOP)."},
    {"question": "What is the difference between fail-fast and fail-safe iterators?", "category": "Technical", "hint": "Fail-fast iterators (like ArrayList's) throw `ConcurrentModificationException` if the collection changes during loop runs. Fail-safe iterators work on clones."},
    {"question": "How do you secure passwords inside application property files?", "category": "Project-Based", "hint": "Encrypt database properties using libraries like Jasypt, decrypting them at runtime, or inject secrets dynamically from cloud environment variables."},
    {"question": "Explain Spring WebFlux. How does it differ from Spring MVC?", "category": "Technical", "hint": "Spring MVC is synchronous and blocking, dedicating one thread per request. WebFlux is reactive and non-blocking, utilizing Netty and event loops for scalability."},
    {"question": "What is the difference between `System.out.println()` and Logger frameworks?", "category": "Technical", "hint": "`Sysout` blocks execution and cannot be configured. Loggers (SLF4J, Logback) support log levels (INFO, ERROR), async writing, and custom file rotations."}
]

# 8. PYTHON_QUESTIONS (50 Items)
PYTHON_QUESTIONS = [
    {"question": "Explain the Global Interpreter Lock (GIL) in Python. How does it affect concurrency?", "category": "Technical", "hint": "The GIL is a mutex protecting access to objects, preventing multiple threads from executing bytecodes concurrently. Threading is effective for I/O, but parallelism for CPU-bound tasks requires multiprocessing."},
    {"question": "How does Python manage memory? Explain reference counting and garbage collection.", "category": "Technical", "hint": "Python uses reference counting. When references hit zero, the object is immediately deallocated. It runs a cyclical garbage collector to find reference loops."},
    {"question": "What is a decorator in Python? Write a simple timer decorator.", "category": "Technical", "hint": "Decorators wrap functions using closures to modify behavior. Timer: `def time_it(f): def wrap(*args, **k): start = time.time(); res = f(*args, **k); print(time.time()-start); return res; return wrap`."},
    {"question": "Explain list comprehensions vs generator expressions in Python.", "category": "Technical", "hint": "List comprehensions calculate all items immediately in memory and return a list. Generator expressions return lazy iterators that yield items one-by-one."},
    {"question": "What are Python dunder (magic) methods? Give two examples.", "category": "Technical", "hint": "Special methods prefixed/suffixed with double underscores. `__str__` returns a readable string. `__len__` defines behavior for the `len()` function."},
    {"question": "What is the difference between staticmethod and classmethod in Python?", "category": "Technical", "hint": "`@classmethod` takes `cls` as first parameter and can alter class state. `@staticmethod` behaves as utility methods, having no access to instance/class states."},
    {"question": "Explain how asyncio works in Python. What is the event loop?", "category": "Technical", "hint": "An async framework implementing cooperative multitasking. The event loop coordinates tasks and resolves non-blocking I/O operations asynchronously using coroutines."},
    {"question": "Compare Django and FastAPI frameworks. When do you use each?", "category": "Technical", "hint": "Django is a full-featured, batteries-included MVC framework. FastAPI is an asynchronous, high-performance micro-framework built on ASGI, utilizing Pydantic types."},
    {"question": "What is the difference between a shallow copy and a deep copy in Python?", "category": "Technical", "hint": "Shallow copy creates a new object but references inner collections. Deep copy recursively copies all inner collections, creating independent structures."},
    {"question": "Explain mutable vs immutable objects in Python.", "category": "Technical", "hint": "Mutable objects can change state in place (lists, dicts, sets). Immutable objects cannot be changed after creation (tuples, strings, ints, floats)."},
    {"question": "What are context managers in Python? How do you implement them?", "category": "Technical", "hint": "Manage resource allocation (like opening files) using `with`. Implement using a class with `__enter__` and `__exit__` methods, or the `@contextmanager` decorator."},
    {"question": "Explain Python's scope resolution: LEGB rule.", "category": "Technical", "hint": "Python searches scopes in order: Local, Enclosing (closures), Global, and Built-in namespaces until a matching variable identifier is found."},
    {"question": "How do you handle exceptions in Python? Explain try-except-else-finally.", "category": "Technical", "hint": "`try` wraps code. `except` catches errors. `else` runs if no error occurred. `finally` executes cleanups regardless of errors."},
    {"question": "What is virtual environment in Python? Compare pip vs poetry.", "category": "Technical", "hint": "Virtual environments isolate package dependencies. `pip` installs flat dependencies. `poetry` handles dependency lockfiles, builds, and packaging in one tool."},
    {"question": "Detail the Django MVC (MVT) architecture.", "category": "Technical", "hint": "Model handles database schema. View contains business logic and calls models. Template renders HTML output using context data passed by the view."},
    {"question": "How do select_related and prefetch_related optimize queries in Django ORM?", "category": "Project-Based", "hint": "`select_related` runs an SQL JOIN on foreign key columns. `prefetch_related` runs separate queries and aggregates results in python, optimized for many-to-many lookup relationships."},
    {"question": "Explain Django middleware. How does it handle requests and responses?", "category": "Technical", "hint": "A hook framework that intercepts requests before reaching views and responses before reaching client browsers, useful for auth, CORS, and logging."},
    {"question": "Explain dependency injection in FastAPI.", "category": "Technical", "hint": "FastAPI uses `Depends(dependency)` to resolve parameters. It manages sharing database sessions, verifying authentication headers, and injecting config settings easily."},
    {"question": "What is Pydantic in FastAPI? How does it enforce validation?", "category": "Technical", "hint": "Pydantic is a data validation library using Python type hints. It parses client payloads, converts types, and throws HTTP 422 errors automatically on mismatch."},
    {"question": "How do you test Python code using pytest? Explain fixtures.", "category": "Project-Based", "hint": "`pytest` runs test functions prefixed with `test_`. Fixtures (`@pytest.fixture`) setup states (like DB connections) and inject them as parameters."},
    {"question": "Explain the difference between `__new__` and `__init__` in Python.", "category": "Technical", "hint": "`__new__` is static, instantiates the object instance in memory, and returns it. `__init__` is the constructor initializer configuring state variables."},
    {"question": "What is a closure in Python? How does it differ from a standard nested function?", "category": "Technical", "hint": "A nested function that retains access to variables from its enclosing outer function's scope even after the outer function has completed execution."},
    {"question": "Explain the use of `yield` in Python generators.", "category": "Technical", "hint": "`yield` pauses function execution and returns a value to the caller, saving local execution state to resume on subsequent `next()` iterations."},
    {"question": "What is Python's descriptor protocol? Name two examples.", "category": "Technical", "hint": "An object implementing `__get__`, `__set__`, or `__delete__` magic methods. Examples: properties (`@property`) and class methods."},
    {"question": "Explain metaclasses in Python. When would you use them?", "category": "Technical", "hint": "A class that defines the behavior of other classes (the class of a class). Use to enforce code constraints or auto-register classes during imports."},
    {"question": "Compare `is` and `==` operators in Python.", "category": "Technical", "hint": "`==` compares value equalities. `is` checks identity equality, verifying if both variables point to the exact same object address in memory."},
    {"question": "What is the difference between thread-safe and non-thread-safe libraries in Python?", "category": "Technical", "hint": "Thread-safe code protects shared variables from concurrent modifications, using locks or queues to prevent race conditions during execution."},
    {"question": "Explain Flask blueprint architecture.", "category": "Project-Based", "hint": "Blueprints are logical application components that group routes and handlers, allowing developers to modularize large Flask projects into cleaner structures."},
    {"question": "What is WSGI vs ASGI in Python web servers?", "category": "Technical", "hint": "WSGI is synchronous and handles one request per thread (Gunicorn). ASGI is asynchronous, supporting WebSockets and long-polling (Uvicorn)."},
    {"question": "How do you implement background tasks in Python using Celery?", "category": "Project-Based", "hint": "Celery is an asynchronous task queue. Define tasks with `@celery.task`, queue them to a broker (Redis/RabbitMQ), and run worker processes to consume them."},
    {"question": "What is the difference between `*args` and `**kwargs`?", "category": "Technical", "hint": "`*args` passes variable positional parameters as a tuple. `**kwargs` passes variable keyword parameters as a dictionary to a function."},
    {"question": "How do you implement a Singleton class pattern in Python?", "category": "Project-Based", "hint": "Override the `__new__` method to check if a class instance variable `_instance` already exists. If not, create it; otherwise, return it."},
    {"question": "Explain exception propagation in Python.", "category": "Technical", "hint": "If an exception is raised and uncaught inside a nested call, it propagates up stack frames until handled by an `except` block or terminating execution."},
    {"question": "What is the purpose of the `sys.path` list in Python?", "category": "Technical", "hint": "A list of directory paths that Python scans to import modules and packages. It includes local directories, system libraries, and site-packages."},
    {"question": "Explain method resolution order (MRO) in Python multiple inheritance.", "category": "Technical", "hint": "Python uses the C3 Linearization algorithm to resolve multiple inheritance paths. Inspect the hierarchy using the `__mro__` attribute or class `.mro()`."},
    {"question": "What is `__slots__` in a Python class? Why is it used?", "category": "Technical", "hint": "Declares class attributes explicitly, preventing dynamic dictionary creation (`__dict__`). It saves memory and speeds up attribute access times."},
    {"question": "How do you profile python code performance?", "category": "Project-Based", "hint": "Use the standard `cProfile` module to measure execution counters, or line_profiler to inspect run times line-by-line in scripts."},
    {"question": "What is the difference between PyTest fixtures and standard setups?", "category": "Project-Based", "hint": "fixtures use dependency injection, allow setting scope scopes (session, class, function), and cleanly teardown resources using `yield` statements."},
    {"question": "Explain how Python imports work. What is circular import?", "category": "Technical", "hint": "Python loads modules and stores them in `sys.modules`. Circular import occurs when module A imports B, and B imports A, causing compilation failures."},
    {"question": "Explain list slicing syntax: `[start:stop:step]`.", "category": "Technical", "hint": "Extracts subsets of collections. `start` is inclusive index. `stop` is exclusive index. `step` is step interval; `[::-1]` reverses the list."},
    {"question": "What is the difference between `repr()` and `str()`?", "category": "Technical", "hint": "`str()` returns a user-friendly readable representation. `repr()` returns an unambiguous developer representation that can ideally recreate the object."},
    {"question": "How does python handle variable argument references: call-by-value or call-by-reference?", "category": "Technical", "hint": "Python uses call-by-object-reference. If you pass mutable objects (lists), modifications persist. If you pass immutable objects (ints), modifications are local."},
    {"question": "What is the purpose of the `pdb` module?", "category": "Project-Based", "hint": "Python's interactive source code debugger. Insert `import pdb; pdb.set_trace()` to pause execution, inspect variables, and step through code."},
    {"question": "Explain the difference between `zip()` and `enumerate()`.", "category": "Technical", "hint": "`zip()` aggregates items from multiple iterators in parallel tuples. `enumerate()` yields tuples of index and item values from a single iterator."},
    {"question": "How do you parse XML or HTML documents in Python?", "category": "Project-Based", "hint": "Use libraries like `xml.etree.ElementTree` for XML parsing, or `BeautifulSoup` (from bs4) for parsing and traversing HTML documents."},
    {"question": "What is the difference between lambda functions and standard def functions?", "category": "Technical", "hint": "Lambdas are anonymous, defined inline using `lambda x: x`, restricted to single expressions, and return evaluations automatically."},
    {"question": "How do you implement abstract classes in Python?", "category": "Project-Based", "hint": "Inherit from the `ABC` class in the `abc` module, and declare abstract methods using the `@abstractmethod` decorator to block direct instantiations."},
    {"question": "What is python's global keyword? When should it be avoided?", "category": "Technical", "hint": "Allows modifying variables defined in global scope inside nested functions. Avoid because it couples logic and creates hidden side-effects."},
    {"question": "Explain the difference between `os.path` and the `pathlib` module.", "category": "Technical", "hint": "`os.path` handles file paths as flat strings. `pathlib` is modern and object-oriented, representing paths as clean system objects."},
    {"question": "What is the purpose of `pipreqs` or `requirements.txt`?", "category": "Project-Based", "hint": "Lists package dependencies with versions. Pipreqs generates clean requirement files scanning code imports, avoiding installing unused dependencies."}
]

# 9. DATABASE_QUESTIONS (50 Items)
DATABASE_QUESTIONS = [
    {"question": "Explain SQL Joins. Detail the differences between Inner, Left, Right, Full, and Cross Joins.", "category": "Technical", "hint": "Inner Join returns records with matching keys in both tables. Left Join returns all from left, filling right nulls where unmatched. Right Join is the reverse. Full Join returns all records. Cross Join returns a Cartesian product."},
    {"question": "How does B-Tree indexing speed up queries? Compare it with Hash indexes.", "category": "Technical", "hint": "B-Tree index maintains sorted balances, searching records in $O(\\log N)$ time. Hash indexes map keys to buckets in $O(1)$ time, but do not support range queries."},
    {"question": "What is the database query execution plan? Why do you use EXPLAIN?", "category": "Technical", "hint": "A roadmap detailing how the database engine retrieves query records (e.g. index scan vs full table scan). Run `EXPLAIN SELECT ...` to identify bottlenecks."},
    {"question": "Explain SQL query optimization techniques.", "category": "Project-Based", "hint": "Use indexes on search filter columns, retrieve only needed columns (avoid `SELECT *`), optimize joins, use CTEs, and avoid nested subqueries in SELECT clauses."},
    {"question": "Explain ACID properties in relational databases.", "category": "Technical", "hint": "Atomicity (all or nothing), Consistency (preserves structural rules), Isolation (separates concurrent transactions), and Durability (persists completed writes)."},
    {"question": "Detail the transaction isolation levels. What concurrency anomalies do they prevent?", "category": "Technical", "hint": "Levels: Read Uncommitted, Read Committed (prevents Dirty Reads), Repeatable Read (prevents Non-Repeatable Reads), and Serializable (prevents Phantom Reads)."},
    {"question": "What is database normalization? Explain 1NF, 2NF, 3NF, and BCNF.", "category": "Technical", "hint": "Reduces redundancy. 1NF: atomic values. 2NF: 1NF + no partial dependencies. 3NF: 2NF + no transitive dependencies. BCNF: stronger version of 3NF."},
    {"question": "Explain database sharding vs replication (Master-Slave).", "category": "Technical", "hint": "Sharding partitions data horizontally across multiple database servers. Replication copies the entire database across nodes (Master writes, Slaves read)."},
    {"question": "Explain optimistic vs pessimistic locking in database transaction management.", "category": "Technical", "hint": "Optimistic locking assumes no conflicts, checking version tags on write. Pessimistic locking locks records directly (`SELECT ... FOR UPDATE`), blocking concurrency."},
    {"question": "What are SQL Window Functions? Give two examples.", "category": "Technical", "hint": "Calculate values across rows related to the current row without collapsing rows. Examples: `ROW_NUMBER() OVER (...)` and `DENSE_RANK() OVER (...)`."},
    {"question": "What is a Common Table Expression (CTE)? When is it preferred over subqueries?", "category": "Technical", "hint": "A temporary result set defined using the `WITH` clause. Preferred because it makes queries readable, modular, and supports recursive queries."},
    {"question": "Explain database triggers and stored procedures.", "category": "Technical", "hint": "Stored procedures are precompiled SQL routines executed on call. Triggers are scripts executed automatically in response to database events (e.g. INSERT)."},
    {"question": "How does MongoDB document store differ from Relational Databases?", "category": "Technical", "hint": "MongoDB stores dynamic schemas as BSON (JSON-like documents), scaling horizontally via sharding, unlike rigid tabular relational databases."},
    {"question": "Explain MongoDB indexing. How does it optimize documents retrieval?", "category": "Technical", "hint": "Creates index keys pointing to document memory locations. Speeds up queries using compound, text, or geospatial indexes, preventing full-collection scans."},
    {"question": "Detail Redis data types. How do you implement caching in Redis?", "category": "Project-Based", "hint": "Data types: Strings, Hashes, Lists, Sets, Sorted Sets. Implement caching by storing serialized JSON payloads mapped to unique key strings with expiration TTLs."},
    {"question": "What are Redis cache eviction policies? Explain LRU and LFU.", "category": "Technical", "hint": "Rules deleting keys when memory limits are hit. LRU (Least Recently Used) deletes keys untouched for the longest time. LFU deletes keys with lowest access counters."},
    {"question": "Explain the CAP Theorem.", "category": "Technical", "hint": "Distributed systems can only guarantee two of: Consistency (same data on all nodes), Availability (every request receives response), or Partition Tolerance."},
    {"question": "What is a wide-column store database? Give an example.", "category": "Technical", "hint": "Stores columns dynamically grouped in column families instead of rigid tables, designed to scale billions of rows. Example: Apache Cassandra."},
    {"question": "Explain the difference between clustered and non-clustered indexes.", "category": "Technical", "hint": "Clustered index defines the physical order of table data (one per table). Non-clustered index creates a separate index table referencing data row addresses."},
    {"question": "What is the N+1 query problem? How do you diagnose it?", "category": "Project-Based", "hint": "Occurs when loading parent records triggers separate queries for each parent's children. Diagnose using database logs or interceptors showing redundant queries."},
    {"question": "Explain database denormalization. When is it acceptable?", "category": "Technical", "hint": "Adding redundant data deliberately to avoid complex joins. Acceptable in read-heavy data warehouses or read-optimized analytical dashboards (OLAP)."},
    {"question": "What is a database transaction? Explain rollback and commit.", "category": "Technical", "hint": "A sequence of operations run as a single unit. `COMMIT` persists modifications permanently. `ROLLBACK` cancels modifications, returning state to baseline."},
    {"question": "Explain SQL injection. How do parameterized inputs block it?", "category": "Technical", "hint": "Injecting malicious commands into raw queries. Parameterized queries precompile the SQL statement structure, forcing inputs to run strictly as values."},
    {"question": "What is a composite index in database tables?", "category": "Technical", "hint": "An index built on multiple columns. Order of columns is critical; queries must filter columns matching left-to-right composite definitions."},
    {"question": "Explain the purpose of database connection pooling.", "category": "Project-Based", "hint": "Maintains a cache of active database connections, reusing them instead of opening and closing connections on each request, minimizing latency."},
    {"question": "Explain standard database backup strategies.", "category": "Project-Based", "hint": "Full backup (saves complete DB), Incremental backup (saves changes since last backup), and Differential backup (saves changes since last full backup)."},
    {"question": "What is the difference between SQL group by and window partition by?", "category": "Technical", "hint": "`GROUP BY` collapses matching records to return single aggregated rows. `PARTITION BY` calculates aggregates over sets but retains all original rows."},
    {"question": "What is recursive CTE in SQL? Give a use case.", "category": "Technical", "hint": "A CTE referencing itself, generating loops. Ideal for hierarchical parent-child tables (e.g. employee reporting hierarchies or category trees)."},
    {"question": "Explain dirty read, non-repeatable read, and phantom read anomalies.", "category": "Technical", "hint": "Dirty Read: reading uncommitted writes. Non-Repeatable Read: reading changed values in a transaction. Phantom Read: reading new inserted rows in a transaction."},
    {"question": "What is the difference between DBMS and RDBMS?", "category": "Technical", "hint": "DBMS is general software storing files in databases. RDBMS stores data in structured tables with defined relational mappings (enforcing ACID)."},
    {"question": "Explain the role of Foreign Keys in database integrity.", "category": "Technical", "hint": "Establishes a link between columns of two tables, enforcing referential integrity (e.g., child records cannot refer to non-existent parents)."},
    {"question": "What is the difference between DELETE, TRUNCATE, and DROP commands?", "category": "Technical", "hint": "`DELETE` is a DML command deleting rows matching filters (supports rollbacks). `TRUNCATE` is DDL, freeing table pages immediately. `DROP` removes table schemas completely."},
    {"question": "Explain database migration scripts. Why are they versioned?", "category": "Project-Based", "hint": "Scripts that modify database schemas. Versioning ensures that developers and servers apply migrations sequentially, maintaining consistent schemas across workspaces."},
    {"question": "What is a graph database? Give a use case.", "category": "Technical", "hint": "A NoSQL database storing nodes and relationships (edges). Ideal for social networks, recommendation engines, and fraud detection maps (Neo4j)."},
    {"question": "Explain how database query cache works.", "category": "Technical", "hint": "Stores SQL select statements and their exact results in memory. If an identical query is received before table writes occur, the cached results are returned immediately."},
    {"question": "What is a view in databases? Compare standard views and materialized views.", "category": "Technical", "hint": "A view is a virtual table querying stored tables dynamically. A materialized view physically saves the query results in memory, requiring manual refreshes."},
    {"question": "Explain database deadlocks. How do database engines resolve them?", "category": "Technical", "hint": "A state where two transactions wait for resources locked by the other. Engines detect circular locks and abort one transaction to break the lock deadlock."},
    {"question": "What is the role of a data warehouse? Compare OLTP vs OLAP.", "category": "Technical", "hint": "OLTP (relational databases) manages fast, concurrent transactional updates. OLAP (data warehouses) compiles complex analytical queries over historical datasets."},
    {"question": "Explain database index fragmentation. How do you resolve it?", "category": "Project-Based", "hint": "Fragmentation occurs when page insertions create gaps in index structures. Resolve by running rebuild index commands (`ALTER INDEX ... REBUILD`)."},
    {"question": "What is the purpose of database partitioning?", "category": "Technical", "hint": "Splits a large table into physical chunks based on key boundaries (e.g., date ranges) to speed up queries by scanning only relevant partitions."},
    {"question": "Explain the difference between optimistic and pessimistic concurrency.", "category": "Technical", "hint": "Optimistic concurrency uses version checks on updates. Pessimistic concurrency locks records immediately upon read, blocking other transactions."},
    {"question": "What is the difference between SQLite and PostgreSQL?", "category": "Technical", "hint": "SQLite is a lightweight, serverless file-based database ideal for local storage. PostgreSQL is a robust, concurrent relational server database built for production scaling."},
    {"question": "Explain NoSQL Key-Value store. Compare with Document store.", "category": "Technical", "hint": "Key-value store maps unique keys to binary payloads (Redis). Document store maps keys to structured objects (JSON in MongoDB), supporting nested queries."},
    {"question": "What is the role of database savepoints in transactions?", "category": "Technical", "hint": "Provides milestones inside a transaction. Allows rolling back operations to specific savepoints without rolling back the entire transaction."},
    {"question": "How do you implement full-text search in relational databases?", "category": "Project-Based", "hint": "Configure full-text indexes on target columns, and query records using lookup clauses like `MATCH() AGAINST()` (MySQL) or `to_tsvector()` (PostgreSQL)."},
    {"question": "What is standard database replication lag?", "category": "Technical", "hint": "The time delay between writing a transaction on the master database server and applying that transaction to reading slave database replicas."},
    {"question": "Explain database isolation level: Serializable.", "category": "Technical", "hint": "The highest isolation level. It forces transactions to execute in an order that matches serial executions, completely blocking dirty/phantom reads but reducing throughput."},
    {"question": "What is a database schema migration lock?", "category": "Technical", "hint": "A table entry used by migration tools (like Flyway) to block concurrent server instances from running migration scripts simultaneously, preventing schema corruptions."},
    {"question": "Explain the difference between SQL standard function `RANK()` and `DENSE_RANK()`.", "category": "Technical", "hint": "`RANK()` skips rank integers if duplicate values share a rank (e.g. 1, 2, 2, 4). `DENSE_RANK()` does not skip rank integers (e.g. 1, 2, 2, 3)."},
    {"question": "How do you secure database credentials in modern web applications?", "category": "Project-Based", "hint": "Inject connection URLs as environment variables from vault systems, and never commit configuration files containing plain-text passwords to git repositories."}
]

# 10. SWE_QUESTIONS (50 Items)
SWE_QUESTIONS = [
    {"question": "What is the difference between a process and a thread?", "category": "Technical", "hint": "A process is an isolated instance of an executing program with its own memory space. A thread is the smallest unit of execution sharing the parent process's memory space, yielding faster context switches."},
    {"question": "Explain the difference between TCP and UDP protocols.", "category": "Technical", "hint": "TCP is connection-oriented, reliable, guarantees packet delivery and order using handshakes. UDP is connectionless, fast, but carries no delivery guarantees (streaming, DNS)."},
    {"question": "What is REST? Describe its key architectural constraints.", "category": "Technical", "hint": "Representational State Transfer. Constraints: Stateless client-server architecture, uniform interface, cacheable responses, layered system, and code-on-demand."},
    {"question": "Detail the SOLID design principles.", "category": "Technical", "hint": "S: Single Responsibility, O: Open/Closed (extend, don't modify), L: Liskov Substitution, I: Interface Segregation, D: Dependency Inversion (decouple dependencies)."},
    {"question": "Explain the Big O notation. Compare time complexities of Binary Search and Bubble Sort.", "category": "Technical", "hint": "Big O measures algorithm scaling. Binary Search runs in $O(\\log N)$ time (logarithmic, splits range). Bubble Sort runs in $O(N^2)$ time (quadratic, nested iteration loops)."},
    {"question": "Explain the MVC (Model-View-Controller) design pattern.", "category": "Technical", "hint": "Model represents database objects and business logic. View renders user interface layouts. Controller acts as glue, routing requests and binding data between model and view."},
    {"question": "What is a database index and why is it used?", "category": "Technical", "hint": "A balanced data structure (typically B-Tree) mapping columns to memory row IDs. It optimizes query searches from $O(N)$ full table scans to $O(\\log N)$ lookups."},
    {"question": "How do you secure user passwords inside databases?", "category": "Technical", "hint": "Do not store plain text. Use cryptographically slow hashing functions (bcrypt, Argon2) combined with unique random salts to prevent dictionary attacks."},
    {"question": "What is a deadlock? List the four Coffman conditions.", "category": "Technical", "hint": "A state where threads block permanently waiting for resources held by each other. Conditions: 1. Mutual Exclusion, 2. Hold and Wait, 3. No Preemption, 4. Circular Wait."},
    {"question": "Explain Monolithic vs Microservices architectures.", "category": "Technical", "hint": "Monolith packages all features in one codebase (simple to test, hard to scale). Microservices isolate features in small services communicating via APIs (scalable, complex network)."},
    {"question": "What is the difference between a stack and a queue data structure?", "category": "Technical", "hint": "Stack is LIFO (Last In First Out); elements are pushed and popped from the same end. Queue is FIFO (First In First Out); items enter at rear and exit at front."},
    {"question": "Explain Binary Search Tree (BST) properties.", "category": "Technical", "hint": "A binary tree where each node's left child contains values less than the node, and the right child contains values greater, yielding $O(\\log N)$ average search times."},
    {"question": "What is Dynamic Programming (DP)? Compare with recursion.", "category": "Technical", "hint": "DP optimizes recursion by solving overlapping subproblems once and caching results (memoization or tabulation), turning exponential time to polynomial time."},
    {"question": "Explain the difference between HTTP and HTTPS.", "category": "Technical", "hint": "HTTP transmits data in plain text. HTTPS encrypts traffic using SSL/TLS protocols to secure data transmission from eavesdropping and tampering."},
    {"question": "Detail the Observer design pattern.", "category": "Technical", "hint": "A behavioral pattern where an object (Subject) maintains a list of dependents (Observers), notifying them automatically of any state changes."},
    {"question": "Explain SOLID Principle: Dependency Inversion.", "category": "Technical", "hint": "High-level modules should not depend on low-level modules; both should depend on abstractions. Abstractions should not depend on details; details should depend on abstractions."},
    {"question": "Explain the difference between compiled and interpreted programming languages.", "category": "Technical", "hint": "Compiled languages (C++) translate source code directly to machine code before execution. Interpreted languages (Python) execute code line-by-line via interpreters at runtime."},
    {"question": "What is a memory leak? How does it occur?", "category": "Technical", "hint": "Occurs when an application allocates memory in the heap but fails to release it back to the system when no longer needed, causing memory exhaustion over time."},
    {"question": "Explain how a Hash Map resolves collisions.", "category": "Technical", "hint": "Collisions occur when different keys hash to the same bucket index. Resolve using Chaining (linked lists/BSTs inside buckets) or Open Addressing (finding alternative empty slots)."},
    {"question": "Explain the difference between GET and POST HTTP methods.", "category": "Technical", "hint": "GET requests retrieve data, appending parameters to the URL string (idempotent). POST requests submit payload data in the HTTP request body to modify state."},
    {"question": "Detail the Singleton design pattern. Write a thread-safe double-checked lock template.", "category": "Technical", "hint": "Restricts class creation to one instance. Double-checked lock: `if(inst==null){ synchronized(Lock.class){ if(inst==null){ inst=new Singleton(); } } } return inst;`."},
    {"question": "Explain the difference between a Graph and a Tree data structure.", "category": "Technical", "hint": "A tree is a connected, acyclic graph with $N$ nodes and $N-1$ edges. A graph can contain cycles, loops, and disconnected nodes."},
    {"question": "Explain Breadth-First Search (BFS) vs Depth-First Search (DFS) traversals.", "category": "Technical", "hint": "BFS explores neighbor nodes level-by-level using a Queue. DFS explores deep down branches recursively or using a Stack before backtracking."},
    {"question": "Explain how Dijkstra's algorithm works.", "category": "Technical", "hint": "Finds the shortest path from a source node to all other nodes in a weighted graph. It uses a priority queue to repeatedly select the unvisited node with minimum distance."},
    {"question": "What is the difference between OAuth 2.0 and SAML?", "category": "Technical", "hint": "OAuth 2.0 is an authorization framework using JSON Web Tokens (JWT) for APIs. SAML is an XML-based authentication protocol used for enterprise Single Sign-On (SSO)."},
    {"question": "Explain the MVC model layer in web applications.", "category": "Technical", "hint": "The model represents the database mapping and data access logic, executing validation checks and queries independent of UI controllers."},
    {"question": "What is a design pattern? List the three main categories.", "category": "Technical", "hint": "Reusable solutions to common software design problems. Categories: Creational (Singleton), Structural (Adapter), and Behavioral (Observer)."},
    {"question": "Explain standard database transaction isolation level: Read Committed.", "category": "Technical", "hint": "Enforces that transactions can only read records that have already been committed, preventing dirty reads but allowing non-repeatable reads."},
    {"question": "What is the purpose of the Factory Design Pattern?", "category": "Technical", "hint": "A creational pattern providing an interface to instantiate objects in a superclass, but letting subclasses decide which concrete class objects to create."},
    {"question": "What is the difference between concurrency and parallelism?", "category": "Technical", "hint": "Concurrency is handling multiple tasks interleaving their execution on a single core. Parallelism is running tasks simultaneously on multiple physical cores."},
    {"question": "Explain Big O complexity: $O(1)$ vs $O(N)$ vs $O(N^2)$ with coding examples.", "category": "Technical", "hint": "$O(1)$: Array lookup (`arr[i]`). $O(N)$: Linear loop searching an array. $O(N^2)$: Nested loops sorting elements (Bubble Sort)."},
    {"question": "What is the difference between abstract classes and interfaces in object-oriented design?", "category": "Technical", "hint": "Abstract classes support instance state variables and single inheritance. Interfaces define contracts supporting multiple inheritance, but cannot hold state."},
    {"question": "Explain how the TCP 3-way handshake establishes a connection.", "category": "Technical", "hint": "1. Client sends SYN (Synchronize). 2. Server replies with SYN-ACK (Acknowledge). 3. Client replies with ACK, establishing the active TCP socket connection."},
    {"question": "What is the difference between a public key and a private key in SSH?", "category": "Technical", "hint": "The public key is placed on the remote server host. The private key is kept secure on the developer's client machine, verifying identity during handshakes."},
    {"question": "Explain the difference between horizontal and vertical scaling.", "category": "Technical", "hint": "Horizontal scaling adds more servers to the cluster pool. Vertical scaling adds more resource hardware (CPU, RAM) to a single existing server VM."},
    {"question": "What is standard RESTful API response code for resource creation?", "category": "Technical", "hint": "Returns HTTP status code `201 Created`, typically accompanied by a JSON payload of the created object and a Location header pointing to the resource URL."},
    {"question": "Explain the SOLID principle: Open/Closed Principle.", "category": "Technical", "hint": "Software entities should be open for extension but closed for modification. Implement changes by extending classes or implementing interfaces rather than rewriting source code."},
    {"question": "What is a memory stack overflow? How does it occur?", "category": "Technical", "hint": "Occurs when call stacks exceed memory boundaries, typically caused by infinite recursion loops failing to hit baseline conditions."},
    {"question": "Explain how a trie (prefix tree) data structure works.", "category": "Technical", "hint": "A search tree storing characters of keys along nodes. It optimizes lookup times for dictionary searches, autocompletions, and prefix matches to $O(L)$ key length."},
    {"question": "What is the difference between a SQL join and a subquery?", "category": "Technical", "hint": "Joins combine columns of two tables into single rows in memory. Subqueries are nested queries inside queries, executed once or repeatedly (correlated)."},
    {"question": "Explain SOLID Principle: Liskov Substitution Principle.", "category": "Technical", "hint": "Objects of a superclass should be replaceable with objects of its subclasses without breaking the application logic or triggering exceptions."},
    {"question": "What is the purpose of a CDN (Content Delivery Network)?", "category": "Technical", "hint": "Caches static assets (images, JS) in globally distributed edge servers closer to clients, reducing network latency and server load times."},
    {"question": "Explain the difference between stateless and stateful APIs.", "category": "Technical", "hint": "Stateless APIs treat requests as independent transactions containing all needed context (JWT). Stateful APIs track client sessions in server memory."},
    {"question": "What is a binary search algorithm? What is its precondition?", "category": "Technical", "hint": "A search algorithm splitting sorted ranges repeatedly in $O(\\log N)$ time. Precondition: the collection must be sorted before running search."},
    {"question": "Explain the difference between a linked list and a dynamic array.", "category": "Technical", "hint": "Dynamic arrays offer fast $O(1)$ random access but slower inserts due to cell shifts. Linked lists offer slow $O(N)$ access but fast $O(1)$ inserts once positioned."},
    {"question": "What is the purpose of design patterns like Adapter?", "category": "Technical", "hint": "A structural design pattern that lets incompatible interfaces collaborate by wrapping an existing class interface inside a new wrapper interface."},
    {"question": "Explain how session cookies maintain user logins.", "category": "Technical", "hint": "The server signs a session ID stored in cookies. On subsequent requests, the browser sends cookies automatically. The server matches the session ID to authenticate the user."},
    {"question": "What is the difference between SQL `UNION` and `UNION ALL`?", "category": "Technical", "hint": "`UNION` combines query results and filters out duplicate rows (sorting overhead). `UNION ALL` combines results and retains duplicates, executing faster."},
    {"question": "Explain SOLID Principle: Interface Segregation.", "category": "Technical", "hint": "Clients should not be forced to depend on interfaces they do not use. Split large interfaces into smaller, specific ones to prevent redundant implementations."},
    {"question": "How do you analyze code space complexity?", "category": "Technical", "hint": "Measures total memory allocated during algorithm run relative to input size $N$. E.g. creating a copy array scales space complexity linearly to $O(N)$."}
]

# Combined BACKEND_QUESTIONS (50 items for compatibility)
BACKEND_QUESTIONS = JAVA_QUESTIONS[:20] + PYTHON_QUESTIONS[:15] + DATABASE_QUESTIONS[:15]

def get_custom_questions(target_role: str) -> list:
    """
    Analyzes target role query and returns a tailored compilation of exactly 50
    high-quality interview questions without generic duplicates.
    """
    role_lower = target_role.lower()

    # Keyword mappings
    categories = {
        "frontend": ["front", "react", "ui", "ux", "angular", "vue", "designer", "html", "css", "js", "javascript", "typescript", "ts", "next.js", "nextjs", "web", "tailwind"],
        "java": ["java", "spring", "hibernate", "jvm", "maven", "gradle", "jpa"],
        "python": ["python", "django", "flask", "fastapi", "pytest", "poetry", "pip"],
        "database": ["database", "db", "sql", "postgres", "mysql", "mongodb", "redis", "nosql", "query", "cassandra", "caching"],
        "devops": ["devops", "docker", "kubernetes", "k8s", "ci/cd", "jenkins", "terraform", "ansible", "aws", "gcp", "azure", "cloud", "infra", "sre", "linux"],
        "qa": ["qa", "test", "testing", "selenium", "automation", "playwright", "cypress", "quality assurance"],
        "data": ["data science", "data scientist", "data analyst", "machine learning", "ml", "nlp", "statistics", "ai", "pandas", "numpy", "deep learning", "neural", "statistics"],
        "security": ["security", "cyber", "cryptography", "jwt", "auth", "encryption", "owasp", "penetration", "hacker"],
        "mobile": ["mobile", "android", "ios", "flutter", "react native", "swift", "kotlin", "apk", "app"],
        "swe": ["software engineer", "swe", "backend", "back-end", "fullstack", "full-stack", "system design", "dsa", "c++", "cpp", "golang", "go ", "c#", "dotnet", "net core"]
    }

    matched = []
    for cat, keywords in categories.items():
        if any(kw in role_lower for kw in keywords):
            matched.append(cat)

    pool = []

    # Map matched strings to question lists
    list_map = {
        "frontend": FRONTEND_QUESTIONS,
        "java": JAVA_QUESTIONS,
        "python": PYTHON_QUESTIONS,
        "database": DATABASE_QUESTIONS,
        "devops": DEVOPS_QUESTIONS,
        "qa": QA_QUESTIONS,
        "data": DATA_QUESTIONS,
        "security": CYBER_QUESTIONS,
        "mobile": MOBILE_QUESTIONS,
        "swe": SWE_QUESTIONS
    }

    # Gather pools
    for cat in matched:
        pool.extend(list_map.get(cat, []))

    # Fallback to general pools if no matches or thin pool
    if len(pool) < 50:
        # If it's a backend role, pull from java, python, database, and general swe
        if "backend" in role_lower or "back-end" in role_lower or "full" in role_lower:
            pool.extend(JAVA_QUESTIONS)
            pool.extend(PYTHON_QUESTIONS)
            pool.extend(DATABASE_QUESTIONS)
        else:
            # General fallback
            pool.extend(SWE_QUESTIONS)
            pool.extend(DATABASE_QUESTIONS)

    # Deduplicate
    seen = set()
    unique_pool = []
    for q in pool:
        if q["question"] not in seen:
            seen.add(q["question"])
            unique_pool.append(q)

    # Dynamically shuffle the pool to ensure query variety and fresh questions
    import random
    random.shuffle(unique_pool)

    # Compile exactly 50 questions
    final_list = unique_pool[:50]

    # If still short, backfill from other lists dynamically
    if len(final_list) < 50:
        all_lists = [FRONTEND_QUESTIONS, JAVA_QUESTIONS, PYTHON_QUESTIONS, DATABASE_QUESTIONS,
                     DEVOPS_QUESTIONS, QA_QUESTIONS, DATA_QUESTIONS, CYBER_QUESTIONS, MOBILE_QUESTIONS, SWE_QUESTIONS]
        shuffled_lists = all_lists.copy()
        random.shuffle(shuffled_lists)
        for q_list in shuffled_lists:
            shuffled_list = q_list.copy()
            random.shuffle(shuffled_list)
            for q in shuffled_list:
                if q["question"] not in seen and len(final_list) < 50:
                    seen.add(q["question"])
                    final_list.append(q)

    # Sort so that Technical/Project questions are presented first, then Behavioral
    tech_qs = [q for q in final_list if q["category"] == "Technical"]
    proj_qs = [q for q in final_list if q["category"] == "Project-Based"]
    beh_qs = [q for q in final_list if q["category"] == "Behavioral"]

    return tech_qs + proj_qs + beh_qs

def find_local_answer(query_text: str) -> str:
    """
    NLP-like fallback keyword scanning to answer chatbot queries using our 500-question database.
    """
    clean_query = query_text.lower().strip()
    
    # 1. Broad categories welcome
    if any(x in clean_query for x in ["hello", "hi", "hey", "welcome", "greetings"]):
        return (
            "**Welcome to PrepBoat AI Mentor!** I am your placement preparation coach.\n\n"
            "I have deep technical knowledge of:\n"
            "- **Frontend**: React, JavaScript, Next.js, CSS\n"
            "- **Backend & DB**: Java/Spring, Python/FastAPI, SQL, NoSQL\n"
            "- **Infrastructure**: DevOps, Cloud, Docker, Kubernetes\n"
            "- **Core CS**: DSA, Operating Systems, Networking, Security, QA Testing\n\n"
            "Ask me any technical question (e.g., *'Explain closures'* or *'How does indexing work?'*) to get started!"
        )

    # 2. Search questions dataset
    all_questions = (FRONTEND_QUESTIONS + JAVA_QUESTIONS + PYTHON_QUESTIONS +
                     DATABASE_QUESTIONS + DEVOPS_QUESTIONS + QA_QUESTIONS +
                     DATA_QUESTIONS + CYBER_QUESTIONS + MOBILE_QUESTIONS + SWE_QUESTIONS)

    best_match = None
    max_matches = 0

    # Tokenize query, stripping common punctuation
    words = [re.sub(r'[^\w]', '', w) for w in clean_query.split()]
    words = [w for w in words if len(w) > 2 and w not in ["explain", "what", "how", "why", "the", "and", "difference", "between", "work"]]

    for q in all_questions:
        q_text_lower = q["question"].lower()
        matches = 0
        for word in words:
            if word in q_text_lower:
                matches += 1
        
        # We give higher weight to exact phrase matching if present
        if clean_query in q_text_lower:
            matches += 5

        if matches > max_matches:
            max_matches = matches
            best_match = q

    if best_match and max_matches >= 2:
        return (
            f"**PrepBoat AI Mentor:** Here is a detailed explanation on **\"{best_match['question']}\"**:\n\n"
            f"{best_match['hint']}\n\n"
            f"*Source: Sourced from Google & GeeksforGeeks placement banks.*"
        )

    # 3. Keyword fallbacks if search matches nothing specific
    if any(x in clean_query for x in ["dsa", "structure", "algorithm", "binary search", "recursion"]):
        return (
            "**PrepBoat AI Mentor - DSA Foundations:**\n\n"
            "Data Structures and Algorithms form the backbone of coding interviews. Make sure you practice:\n"
            "- **Complexity Analysis**: Big O notation for time/space limits ($O(1)$ to $O(N^2)$).\n"
            "- **Data Structures**: Arrays, Linked Lists, Stacks, Queues, Binary Trees, and Hash Tables.\n"
            "- **Dynamic Programming**: Optimizing recursion by memoizing subproblems.\n\n"
            "Ask me about a specific structure or pattern (e.g. *'What is a binary search tree?'*)!"
        )
    elif any(x in clean_query for x in ["sql", "join", "query", "database", "indexing"]):
        return (
            "**PrepBoat AI Mentor - Databases:**\n\n"
            "Relational database concepts are frequently tested. Key topics:\n"
            "- **Joins**: INNER (matching keys), LEFT (all left rows + matching right), FULL (all records).\n"
            "- **Indexing**: Uses B-Trees to speed up searches from $O(N)$ to $O(\\log N)$ disk reads.\n"
            "- **ACID**: Atomicity (all-or-nothing), Consistency, Isolation (levels prevent anomalies), Durability.\n\n"
            "Try asking: *'Explain SQL joins'* or *'Explain transaction isolation levels'*!"
        )
    elif any(x in clean_query for x in ["resume", "cv", "ats"]):
        return (
            "**PrepBoat AI Mentor - Resume Guidance:**\n\n"
            "A placement-grade resume must follow these rules:\n"
            "1. **Format**: One page, single-column, clean font (e.g. Inter/Arial). No graphic meters.\n"
            "2. **Impact**: Use action-verbs + quantifiable metrics (*'Optimized DB index, lowering latency 25%'*).\n"
            "3. **Keywords**: Scan the target Job Description and inject missing technology skills.\n\n"
            "Upload your PDF inside our **AI Resume Analyzer** tab to get an automated audit!"
        )
    elif any(x in clean_query for x in ["react", "hooks", "frontend"]):
        return (
            "**PrepBoat AI Mentor - React & Frontend:**\n\n"
            "React interviews focus on performance and rendering models:\n"
            "- **Virtual DOM**: React compares state updates (diffing) and updates the real DOM (reconciliation).\n"
            "- **Hooks Rules**: Hooks must run at the top level and in the same order on every render.\n"
            "- **Performance**: Use `useCallback`/`useMemo` to cache references and `React.lazy` to code-split.\n\n"
            "Try asking: *'What is the Virtual DOM?'* or *'What is prototypal inheritance?'*!"
        )
    
    # 4. Universal fallback reply
    return (
        "**PrepBoat AI Mentor:**\n\n"
        "I'm here to guide you through your placements! I can answer questions about "
        "DSA, SQL, System Design, React, Java, Python, DevOps, and Cyber Security.\n\n"
        "Could you please rephrase your question or specify the technology (e.g. *'What is a closure in JavaScript?'*) "
        "so I can provide the exact placement guidelines?"
    )
