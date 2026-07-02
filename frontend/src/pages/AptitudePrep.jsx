import React, { useState, useEffect } from 'react';
import { 
  Brain, Search, Play, CheckCircle2, ChevronRight, ChevronDown, 
  Award, Clock, BookOpen, Calculator, Calendar, HelpCircle, 
  ArrowRight, Sparkles, Check, X, Flame, BarChart2
} from 'lucide-react';

const AptitudePrep = () => {
  // State variables for dynamic 40 questions loading and evaluation
  const [activeTopicId, setActiveTopicId] = useState('percentage');
  const [searchTerm, setSearchTerm] = useState('');
  const [allQuestions, setAllQuestions] = useState(null);
  const [activeQuestionIdx, setActiveQuestionIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState({}); // topicId -> { questionIdx -> { selectedOption, isCorrect } }
  const [showExplanation, setShowExplanation] = useState(false);
  
  const [completedTopics, setCompletedTopics] = useState(() => {
    const saved = localStorage.getItem('aptitude_completed_topics');
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem('aptitude_completed_topics', JSON.stringify(completedTopics));
  }, [completedTopics]);

  // Load 1,280 aptitude questions database on mount
  useEffect(() => {
    fetch('/aptitude_questions.json')
      .then(res => res.json())
      .then(data => setAllQuestions(data))
      .catch(err => console.error("Failed to load aptitude questions database: ", err));
  }, []);

  // Reset active question and explanation toggles when topic changes
  useEffect(() => {
    setActiveQuestionIdx(0);
    setShowExplanation(false);
  }, [activeTopicId]);

  // The topics array:
  const topics = [
    // Must Complete First
    {
      id: 'percentage',
      title: 'Percentage',
      priority: 'Must Complete First',
      priorityColor: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
      videoUrl: 'https://www.youtube.com/embed/RWdNhJWwzSs',
      formulas: [
        'Percentage = (Part / Whole) * 100',
        'Percentage Increase = (Increase / Original) * 100',
        'Percentage Decrease = (Decrease / Original) * 100'
      ],
      tricks: [
        'x% of y = y% of x',
        'Common fractions: 25% = 1/4, 50% = 1/2, 75% = 3/4',
        'To find 10% divide by 10; to find 1% divide by 100'
      ],
      example: {
        question: 'Three candidates contested an election and received 1136, 7636 and 11628 votes respectively. What percentage of the total votes did the winning candidate get?',
        options: ['57%', '60%', '65%', '54%'],
        answer: '57%',
        explanation: 'Total votes polled = (1136 + 7636 + 11628) = 20400.\nWinning candidate got 11628 votes.\nRequired percentage = (11628 / 20400) * 100 = 57%.'
      }
    },
    {
      id: 'profit-loss',
      title: 'Profit and Loss',
      priority: 'Must Complete First',
      priorityColor: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
      videoUrl: 'https://www.youtube.com/embed/T2odvmxqi1I',
      formulas: [
        'Profit = SP - CP',
        'Loss = CP - SP',
        'Profit% = (Profit / CP) * 100',
        'Loss% = (Loss / CP) * 100'
      ],
      tricks: [
        '20% profit means SP = 120% of CP',
        '15% loss means SP = 85% of CP',
        'When SP of two items is same, one sold at x% profit and another at x% loss, there is always an overall loss of (x/10)^2 %'
      ],
      example: {
        question: 'Alfred buys an old scooter for ₹4700 and spends ₹800 on its repairs. If he sells the scooter for ₹5800, his gain percent is:',
        options: ['4(4/7)%', '5(5/11)%', '10%', '12%'],
        answer: '5(5/11)%',
        explanation: 'Total Cost Price (CP) = 4700 + 800 = ₹5500.\nSelling Price (SP) = ₹5800.\nGain = SP - CP = 5800 - 5500 = ₹300.\nGain% = (300 / 5500) * 100 = 300/55 = 60/11 = 5(5/11)%.'
      }
    },
    {
      id: 'ratio-proportion',
      title: 'Ratio and Proportion',
      priority: 'Must Complete First',
      priorityColor: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
      videoUrl: 'https://www.youtube.com/embed/rhSxQ4ieAYc',
      formulas: [
        'If a:b = c:d, then a/b = c/d',
        'Cross multiplication: ad = bc',
        'Mean proportional between a and b is √(ab)',
        'Third proportional of a and b is b^2 / a'
      ],
      tricks: [
        'If a:b and b:c are given, equate b by taking LCM to find a:b:c',
        'Duplicate Ratio of a:b is a^2 : b^2',
        'Sub-duplicate Ratio of a:b is √a : √b'
      ],
      example: {
        question: 'If A : B = 2 : 3 and B : C = 4 : 5, then find A : B : C.',
        options: ['8 : 12 : 15', '2 : 4 : 5', '6 : 9 : 15', '8 : 10 : 12'],
        answer: '8 : 12 : 15',
        explanation: 'Multiply A:B by 4 -> 8:12\nMultiply B:C by 3 -> 12:15\nSo, A:B:C = 8:12:15.'
      }
    },
    {
      id: 'average',
      title: 'Average',
      priority: 'Must Complete First',
      priorityColor: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
      videoUrl: 'https://www.youtube.com/embed/rhSxQ4ieAYc',
      formulas: [
        'Average = Sum of terms / Number of terms',
        'Sum of terms = Average * Number of terms'
      ],
      tricks: [
        'If every term increases or decreases by a constant k, the average also increases or decreases by k.',
        'Average of first n natural numbers = (n + 1) / 2',
        'Average speed for equal distances at speeds x and y = 2xy / (x + y) km/hr'
      ],
      example: {
        question: 'The average of five numbers is 27. If one number is excluded, the average becomes 25. The excluded number is:',
        options: ['35', '27', '30', '40'],
        answer: '35',
        explanation: 'Sum of 5 numbers = 27 * 5 = 135.\nSum of 4 numbers = 25 * 4 = 100.\nExcluded number = 135 - 100 = 35.'
      }
    },
    {
      id: 'time-work',
      title: 'Time and Work',
      priority: 'Must Complete First',
      priorityColor: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
      videoUrl: 'https://www.youtube.com/embed/jzNxXm5twx4',
      formulas: [
        'If A completes a work in x days, one day work = 1/x',
        'If A and B work together, their one day work = 1/x + 1/y',
        'Time taken together = xy / (x + y) days',
        'Work = Rate * Time'
      ],
      tricks: [
        'If A takes x days and B takes y days, together they take xy / (x+y) days.',
        'Formula: M1 * D1 * H1 / W1 = M2 * D2 * H2 / W2 (where M=men, D=days, H=hours, W=work)'
      ],
      example: {
        question: 'A can do a work in 15 days and B in 20 days. If they work on it together for 4 days, then the fraction of the work that is left is:',
        options: ['8/15', '7/15', '1/4', '1/10'],
        answer: '8/15',
        explanation: "A's 1 day work = 1/15, B's 1 day work = 1/20.\nTogether 1 day work = 1/15 + 1/20 = 7/60.\nWork done in 4 days = 4 * (7/60) = 7/15.\nRemaining work = 1 - 7/15 = 8/15."
      }
    },
    {
      id: 'speed-distance',
      title: 'Time Speed Distance',
      priority: 'Must Complete First',
      priorityColor: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
      videoUrl: 'https://www.youtube.com/embed/jzNxXm5twx4',
      formulas: [
        'Distance = Speed * Time',
        'Speed = Distance / Time',
        'Time = Distance / Speed',
        '1 km/hr = 5/18 m/s',
        '1 m/s = 18/5 km/hr'
      ],
      tricks: [
        'If a body travels equal distances at x km/hr and y km/hr, average speed = 2xy/(x+y) km/hr',
        'Relative speed (Same Direction) = S1 - S2',
        'Relative speed (Opposite Direction) = S1 + S2'
      ],
      example: {
        question: 'A person crosses a 600 m long street in 5 minutes. What is his speed in km per hour?',
        options: ['7.2 km/hr', '3.6 km/hr', '8.4 km/hr', '10 km/hr'],
        answer: '7.2 km/hr',
        explanation: 'Distance = 600 m.\nTime = 5 minutes = 300 seconds.\nSpeed = 600 / 300 = 2 m/s.\nSpeed in km/hr = 2 * (18/5) = 36/5 = 7.2 km/hr.'
      }
    },
    {
      id: 'probability',
      title: 'Probability',
      priority: 'Must Complete First',
      priorityColor: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
      videoUrl: 'https://www.youtube.com/embed/tJHl73PBnwY',
      formulas: [
        'P(E) = Favorable Outcomes / Total Outcomes',
        'P(E) + P(E\') = 1',
        'For independent events: P(A ∩ B) = P(A) * P(B)'
      ],
      tricks: [
        'Probability always ranges between 0 and 1.',
        'Coin Tossing: Total outcomes for n coins = 2^n.',
        'Dice Rolling: Total outcomes for n dice = 6^n.'
      ],
      example: {
        question: 'In a throw of a coin, find the probability of getting a head.',
        options: ['1/2', '1/4', '1', '0'],
        answer: '1/2',
        explanation: 'Favorable outcome = {H} (Count = 1).\nTotal outcomes = {H, T} (Count = 2).\nP(E) = 1/2.'
      }
    },
    {
      id: 'permutation',
      title: 'Permutation',
      priority: 'Must Complete First',
      priorityColor: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
      videoUrl: 'https://www.youtube.com/embed/tJHl73PBnwY',
      formulas: [
        'nPr = n! / (n - r)!',
        '0! = 1'
      ],
      tricks: [
        'Permutation represents arrangements where order matters.',
        'If there are n items with p alike of one kind, q alike of another: arrangements = n! / (p! * q!)'
      ],
      example: {
        question: 'In how many ways can 5 people be seated in a row of 5 chairs?',
        options: ['120', '24', '60', '720'],
        answer: '120',
        explanation: 'Number of ways = 5P5 = 5! = 120.'
      }
    },
    {
      id: 'combination',
      title: 'Combination',
      priority: 'Must Complete First',
      priorityColor: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
      videoUrl: 'https://www.youtube.com/embed/tJHl73PBnwY',
      formulas: [
        'nCr = n! / (r! * (n - r)!)',
        'nCr = nC(n-r)',
        'nC0 = nCn = 1'
      ],
      tricks: [
        'Combination represents selections where order does NOT matter.',
        'Total selections of any number of items from n items = 2^n - 1'
      ],
      example: {
        question: 'In how many ways can a committee of 3 be chosen from 5 people?',
        options: ['10', '20', '5', '15'],
        answer: '10',
        explanation: 'Number of selections = 5C3 = 5! / (3! * 2!) = (5 * 4) / 2 = 10.'
      }
    },
    {
      id: 'number-system',
      title: 'Number System',
      priority: 'Must Complete First',
      priorityColor: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
      videoUrl: 'https://www.youtube.com/embed/xyyejJYeILM',
      formulas: [
        'Divisibility by 2: Last digit is even.',
        'Divisibility by 3: Sum of digits is divisible by 3.',
        'Divisibility by 4: Last 2 digits are divisible by 4.',
        'Divisibility by 5: Ends with 0 or 5.',
        'Divisibility by 6: Divisible by both 2 and 3.',
        'Divisibility by 8: Last 3 digits are divisible by 8.',
        'Divisibility by 9: Sum of digits is divisible by 9.',
        'Divisibility by 11: Difference of alternate digit sums is 0 or multiple of 11.'
      ],
      tricks: [
        'A prime number has only two divisors: 1 and itself.',
        'To test if N is prime, find √N and check divisibility by prime numbers less than √N.'
      ],
      example: {
        question: 'Which of the following numbers is divisible by 11?',
        options: ['12121', '13310', '45672', '89100'],
        answer: '13310',
        explanation: 'For 13310: sum of odd positions = 1 + 3 + 0 = 4. Sum of even positions = 3 + 1 = 4.\nDifference = 4 - 4 = 0. So it is divisible by 11.'
      }
    },
    {
      id: 'hcf-lcm',
      title: 'HCF and LCM',
      priority: 'Must Complete First',
      priorityColor: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
      videoUrl: 'https://www.youtube.com/embed/xyyejJYeILM',
      formulas: [
        'HCF * LCM = Product of two numbers (For 2 numbers only)',
        'HCF of Fractions = HCF of Numerators / LCM of Denominators',
        'LCM of Fractions = LCM of Numerators / HCF of Denominators'
      ],
      tricks: [
        'HCF (Highest Common Factor) is also called GCD (Greatest Common Divisor).',
        'LCM (Lowest Common Multiple) is the smallest number divisible by all given numbers.'
      ],
      example: {
        question: 'Find the HCF of 12 and 18.',
        options: ['6', '2', '3', '36'],
        answer: '6',
        explanation: 'Prime factors:\n12 = 2^2 * 3\n18 = 2 * 3^2\nHCF = 2 * 3 = 6.'
      }
    },

    // Medium Priority
    {
      id: 'si',
      title: 'Simple Interest (SI)',
      priority: 'Medium Priority',
      priorityColor: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
      videoUrl: 'https://www.youtube.com/embed/T2odvmxqi1I',
      formulas: [
        'SI = (P * R * T) / 100',
        'Amount = Principal + SI = P + (P * R * T / 100)'
      ],
      tricks: [
        'If principal P doubles itself in T years, then rate R = 100 / T %',
        'If amount becomes n times in T years, R = (n - 1) * 100 / T %'
      ],
      example: {
        question: 'How much interest will ₹5000 earn at 10% per annum in 2 years?',
        options: ['₹1000', '₹500', '₹1200', '₹6000'],
        answer: '₹1000',
        explanation: 'P = 5000, R = 10%, T = 2.\nSI = (5000 * 10 * 2) / 100 = 1000.\nAmount = 5000 + 1000 = ₹6000.'
      }
    },
    {
      id: 'ci',
      title: 'Compound Interest (CI)',
      priority: 'Medium Priority',
      priorityColor: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
      videoUrl: 'https://www.youtube.com/embed/T2odvmxqi1I',
      formulas: [
        'Amount (A) = P * (1 + R/100)^T',
        'CI = A - P'
      ],
      tricks: [
        'For 2 years, difference between CI and SI: CI - SI = P * (R/100)^2',
        'For 3 years, difference: CI - SI = P * (R/100)^2 * (3 + R/100)'
      ],
      example: {
        question: 'Find the compound interest on ₹1000 for 2 years at 10% per annum, compounded annually.',
        options: ['₹210', '₹200', '₹1210', '₹220'],
        answer: '₹210',
        explanation: 'P = 1000, R = 10, T = 2.\nA = 1000 * (1 + 10/100)^2 = 1000 * (1.1)^2 = 1000 * 1.21 = 1210.\nCI = 1210 - 1000 = ₹210.'
      }
    },
    {
      id: 'ages',
      title: 'Ages',
      priority: 'Medium Priority',
      priorityColor: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
      videoUrl: 'https://www.youtube.com/embed/tJHl73PBnwY',
      formulas: [
        'If present age is x, age n years ago = x - n',
        'Age n years from now = x + n'
      ],
      tricks: [
        'The age difference between two people remains constant over time.',
        'If ratio of ages is a:b, we can assume ages to be ax and bx.'
      ],
      example: {
        question: 'A father is 40 years old and his son is 10 years old. What will be the ratio of their ages after 10 years?',
        options: ['5:2', '4:1', '3:1', '2:1'],
        answer: '5:2',
        explanation: 'After 10 years, Father age = 40 + 10 = 50. Son age = 10 + 10 = 20.\nRatio = 50 : 20 = 5 : 2.'
      }
    },
    {
      id: 'partnership',
      title: 'Partnership',
      priority: 'Medium Priority',
      priorityColor: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
      videoUrl: 'https://www.youtube.com/embed/rhSxQ4ieAYc',
      formulas: [
        'Profit Share Ratio = (Capital1 * Time1) : (Capital2 * Time2)'
      ],
      tricks: [
        'If investments are equal, profits are shared in ratio of time periods.',
        'If time periods are equal, profits are shared in ratio of capitals.'
      ],
      example: {
        question: 'A and B invest ₹10000 and ₹5000 respectively for 12 months. If the total profit is ₹3000, find A\'s share.',
        options: ['₹2000', '₹1000', '₹1500', '₹2500'],
        answer: '₹2000',
        explanation: 'Investment ratio = 10000 : 5000 = 2 : 1.\nTotal profit = 3000.\nA\'s share = 3000 * (2/3) = ₹2000.'
      }
    },
    {
      id: 'boats-streams',
      title: 'Boats and Streams',
      priority: 'Medium Priority',
      priorityColor: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
      videoUrl: 'https://www.youtube.com/embed/jzNxXm5twx4',
      formulas: [
        'Downstream Speed (D) = B + S (where B=Boat speed, S=Stream speed)',
        'Upstream Speed (U) = B - S',
        'Boat Speed in still water (B) = (D + U) / 2',
        'Stream Speed (S) = (D - U) / 2'
      ],
      tricks: [
        'Downstream means moving with the water flow (faster).',
        'Upstream means moving against the water flow (slower).'
      ],
      example: {
        question: 'A boat speed is 20 km/hr in still water and stream speed is 5 km/hr. Find downstream speed.',
        options: ['25 km/hr', '15 km/hr', '20 km/hr', '10 km/hr'],
        answer: '25 km/hr',
        explanation: 'B = 20, S = 5.\nDownstream speed = B + S = 20 + 5 = 25 km/hr.'
      }
    },
    {
      id: 'pipes-cisterns',
      title: 'Pipes and Cisterns',
      priority: 'Medium Priority',
      priorityColor: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
      videoUrl: 'https://www.youtube.com/embed/jzNxXm5twx4',
      formulas: [
        'Inlet pipe work = +1/x',
        'Outlet/leak pipe work = -1/y',
        'Net Work = Sum of rates of active pipes'
      ],
      tricks: [
        'Same principles as Time & Work.',
        'If a pipe fills a tank in x hours and another empties in y hours, and y > x, net filling rate = 1/x - 1/y'
      ],
      example: {
        question: 'Pipe A can fill a tank in 10 hours and Pipe B can empty it in 15 hours. If both are opened, in how many hours will the tank be filled?',
        options: ['30 hours', '6 hours', '12 hours', '15 hours'],
        answer: '30 hours',
        explanation: 'Rate of A = 1/10 (filling).\nRate of B = -1/15 (emptying).\nCombined rate = 1/10 - 1/15 = (3 - 2)/30 = 1/30.\nTank fills in 30 hours.'
      }
    },
    {
      id: 'mixtures',
      title: 'Mixtures and Allegations',
      priority: 'Medium Priority',
      priorityColor: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
      videoUrl: 'https://www.youtube.com/embed/T2odvmxqi1I',
      formulas: [
        'Allegation Rule: Ratio = (Dearer Price - Mean Price) / (Mean Price - Cheaper Price)'
      ],
      tricks: [
        'Used to find the ratio in which two ingredients of different prices must be mixed to produce a mixture of a given mean price.'
      ],
      example: {
        question: 'In what ratio must rice at ₹20 per kg be mixed with rice at ₹30 per kg to obtain a mixture worth ₹25 per kg?',
        options: ['1:1', '1:2', '2:3', '3:1'],
        answer: '1:1',
        explanation: 'Cheaper (C) = 20, Dearer (D) = 30, Mean (M) = 25.\nRatio = (D - M) / (M - C) = (30 - 25) / (25 - 20) = 5 / 5 = 1:1.'
      }
    },
    {
      id: 'trains',
      title: 'Trains',
      priority: 'Medium Priority',
      priorityColor: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
      videoUrl: 'https://www.youtube.com/embed/jzNxXm5twx4',
      formulas: [
        'Time to cross pole = Train Length / Speed',
        'Time to cross platform = (Train Length + Platform Length) / Speed',
        'Relative speeds: Add if opposite directions, subtract if same direction.'
      ],
      tricks: [
        'Always convert speed to m/s if train length is in meters and time is in seconds.'
      ],
      example: {
        question: 'A train 120m long passes a telegraph post in 6 seconds. The speed of the train is:',
        options: ['72 km/hr', '20 km/hr', '60 km/hr', '36 km/hr'],
        answer: '72 km/hr',
        explanation: 'Speed = Length / Time = 120 / 6 = 20 m/s.\nIn km/hr = 20 * 18/5 = 72 km/hr.'
      }
    },
    {
      id: 'geometry',
      title: 'Geometry',
      priority: 'Medium Priority',
      priorityColor: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
      videoUrl: 'https://www.youtube.com/embed/RWdNhJWwzSs',
      formulas: [
        'Rectangle Area = l * b, Perimeter = 2(l + b)',
        'Square Area = a^2, Perimeter = 4a',
        'Triangle Area = 1/2 * b * h',
        'Circle Area = π * r^2, Circumference = 2 * π * r'
      ],
      tricks: [
        'Sum of angles in a triangle is 180 degrees.',
        'Pythagoras theorem for right triangles: a^2 + b^2 = c^2'
      ],
      example: {
        question: 'Find the area of a circle with a radius of 3.00 (take π ≈ 3.1416).',
        options: ['28.27', '18.85', '9.42', '14.13'],
        answer: '28.27',
        explanation: 'Area = π * r^2 = 3.1416 * 3^2 = 3.1416 * 9 ≈ 28.27.'
      }
    },
    {
      id: 'mensuration',
      title: 'Mensuration',
      priority: 'Medium Priority',
      priorityColor: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
      videoUrl: 'https://www.youtube.com/embed/RWdNhJWwzSs',
      formulas: [
        'Cube Volume = a^3, Surface Area = 6 * a^2',
        'Cuboid Volume = l * b * h',
        'Cylinder Volume = π * r^2 * h',
        'Cone Volume = 1/3 * π * r^2 * h',
        'Sphere Volume = 4/3 * π * r^3'
      ],
      tricks: [
        'Be careful to match all units (e.g., cm and m) before starting calculations.'
      ],
      example: {
        question: 'Find the volume of a cylinder with radius 3m and height 5m (approx).',
        options: ['141.37 m³', '47.12 m³', '28.27 m³', '15 m³'],
        answer: '141.37 m³',
        explanation: 'Volume = π * r^2 * h = 3.14159 * 3^2 * 5 = 3.14159 * 9 * 5 = 141.37 m³.'
      }
    },

    // Advanced Topics
    {
      id: 'logarithms',
      title: 'Logarithms',
      priority: 'Advanced',
      priorityColor: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
      videoUrl: 'https://www.youtube.com/embed/tnc9ojITRg4',
      formulas: [
        'log_a(a^n) = n',
        'log(xy) = log(x) + log(y)',
        'log(x/y) = log(x) - log(y)',
        'log(x^y) = y * log(x)'
      ],
      tricks: [
        'Change of base rule: log_b(a) = log_c(a) / log_c(b)'
      ],
      example: {
        question: 'Evaluate log_2(8).',
        options: ['3', '4', '8', '2'],
        answer: '3',
        explanation: '8 = 2^3.\nSo, log_2(8) = log_2(2^3) = 3 * log_2(2) = 3 * 1 = 3.'
      }
    },
    {
      id: 'surds-indices',
      title: 'Surds and Indices',
      priority: 'Advanced',
      priorityColor: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
      videoUrl: 'https://www.youtube.com/embed/tnc9ojITRg4',
      formulas: [
        'a^m * a^n = a^(m + n)',
        'a^m / a^n = a^(m - n)',
        '(a^m)^n = a^(mn)',
        '(ab)^n = a^n * b^n'
      ],
      tricks: [
        'Any non-zero base raised to the power 0 is 1. (a^0 = 1)'
      ],
      example: {
        question: 'Simplify 2³ × 2².',
        options: ['32', '16', '64', '8'],
        answer: '32',
        explanation: '2^3 * 2^2 = 2^(3+2) = 2^5 = 32.'
      }
    },
    {
      id: 'di',
      title: 'Data Interpretation',
      priority: 'Advanced',
      priorityColor: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
      videoUrl: 'https://www.youtube.com/embed/tnc9ojITRg4',
      formulas: [
        'Percentage Change = ((New - Old) / Old) * 100',
        'Ratio comparison = Compare Numerator / Denominator',
        'Average = Sum of values / Count'
      ],
      tricks: [
        'Familiarize yourself with Bar Graphs, Pie Charts, Line Graphs, Tables, and Mixed Graphs.',
        'Always skim the units (e.g. In Millions, In Thousands) on axes before solving.'
      ],
      example: {
        question: 'Sales of a company increased from 100 Million to 120 Million. What is the percentage change?',
        options: ['20%', '10%', '25%', '15%'],
        answer: '20%',
        explanation: 'Percentage Change = ((120 - 100) / 100) * 105 = (20 / 100) * 100 = 20%.'
      }
    },
    {
      id: 'simplification',
      title: 'Simplification',
      priority: 'Advanced',
      priorityColor: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
      videoUrl: 'https://www.youtube.com/embed/tnc9ojITRg4',
      formulas: [
        'BODMAS: Bracket, Order, Division, Multiplication, Addition, Subtraction'
      ],
      tricks: [
        'Always execute operations in the order defined by BODMAS rule to prevent calculation bugs.'
      ],
      example: {
        question: 'Evaluate 20 + 5 × 2.',
        options: ['30', '50', '25', '20'],
        answer: '30',
        explanation: 'Multiply first: 5 * 2 = 10.\nAdd next: 20 + 10 = 30.'
      }
    },

    // Mathematical Tools
    {
      id: 'squares',
      title: 'Important Squares (1–30)',
      priority: 'Math Tool',
      priorityColor: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
      formulas: [
        '11² = 121, 12² = 144, 13² = 169, 14² = 196, 15² = 225',
        '16² = 256, 17² = 289, 18² = 324, 19² = 361, 20² = 400',
        '21² = 441, 22² = 484, 23² = 529, 24² = 576, 25² = 625',
        '26² = 676, 27² = 729, 28² = 784, 29² = 841, 30² = 900'
      ],
      tricks: [
        'Memorizing squares from 1 to 30 accelerates speed math dramatically in numerical tests.'
      ],
      example: {
        question: 'What is 25²?',
        options: ['625', '576', '676', '529'],
        answer: '625',
        explanation: '25 * 25 = 625.'
      }
    },
    {
      id: 'cubes',
      title: 'Important Cubes (1–20)',
      priority: 'Math Tool',
      priorityColor: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
      formulas: [
        '1³=1, 2³=8, 3³=27, 4³=64, 5³=125, 6³=216, 7³=343, 8³=512, 9³=729, 10³=1000',
        '11³=1331, 12³=1728, 13³=2197, 14³=2744, 15³=3375, 16³=4096, 17³=4913, 18³=5832, 19³=6859, 20³=8000'
      ],
      tricks: [
        'Cubes are frequently asked in compound interest (3 years) and volume-related math.'
      ],
      example: {
        question: 'What is 15³?',
        options: ['3375', '2744', '4096', '2197'],
        answer: '3375',
        explanation: '15 * 15 * 15 = 225 * 15 = 3375.'
      }
    },
    {
      id: 'vedic-math',
      title: 'Vedic Math Tricks',
      priority: 'Math Tool',
      priorityColor: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
      formulas: [
        'Multiply by 11: 43 × 11 -> 4 [4+3] 3 = 473',
        'Square Ending in 5: 35² -> (3 × (3+1)) [25] = 1225',
        'Percentages: 10% of 680 = 68, 5% = 34, so 15% = 102'
      ],
      tricks: [
        'Use these shortcuts for rapid calculations during time-constrained coding and placement aptitude rounds.'
      ],
      example: {
        question: 'Multiply 43 by 11 using the Vedic shortcut.',
        options: ['473', '431', '4311', '463'],
        answer: '473',
        explanation: 'Write outer digits: 4 and 3.\nInsert sum in between: 4 + 3 = 7.\nResult = 473.'
      }
    }
  ];

  const activeTopic = topics.find(t => t.id === activeTopicId) || topics[0];

  // List all topics in a single list, allowing simple text filter
  const filteredTopics = topics.filter(t => 
    t.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleTopicCompletion = (topicId) => {
    setCompletedTopics(prev => ({
      ...prev,
      [topicId]: !prev[topicId]
    }));
  };

  const currentQuestions = allQuestions ? allQuestions[activeTopicId] || [] : [];
  const currentQuestion = currentQuestions[activeQuestionIdx] || null;

  const handleAnswerClick = (option) => {
    if (!currentQuestion) return;
    const isCorrect = option === currentQuestion.answer;
    
    // Save user answer log per topic/question index
    setUserAnswers(prev => {
      const topicAns = prev[activeTopicId] || {};
      const newTopicAns = {
        ...topicAns,
        [activeQuestionIdx]: {
          selectedOption: option,
          isCorrect: isCorrect
        }
      };
      return {
        ...prev,
        [activeTopicId]: newTopicAns
      };
    });

    setShowExplanation(true);
  };

  // Calculations for progress
  const totalTopicsCount = topics.length;
  const completedTopicsCount = Object.values(completedTopics).filter(Boolean).length;
  const topicsPercentage = Math.round((completedTopicsCount / totalTopicsCount) * 100);

  return (
    <div className="space-y-4 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 h-[calc(100vh-6rem)] overflow-y-auto">
      
      {/* Hero Header */}
      <div className="glass-panel p-4 rounded-lg border border-slate-200 bg-white relative overflow-hidden shadow-sm">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-semibold">
              <Sparkles size={12} fill="currentColor" />
              <span>Aptitude Prep Center</span>
            </div>
            <h1 className="text-sm font-black text-black tracking-tight">
              Aptitude Preparation Guide
            </h1>
            <p className="text-slate-900 text-xs leading-relaxed max-w-xl">
              Comprehensive prep content for Amazon, TCS, Infosys, Accenture, Wipro, Cognizant, and college placement drives. Master math concepts, shortcuts, and study guides.
            </p>
          </div>
          
          <div className="flex gap-4">
            {/* Progress Card */}
            <div className="glass-panel p-4 rounded-lg border border-slate-200 bg-slate-50 min-w-[12rem] flex flex-col justify-between">
              <div className="flex items-center justify-between text-sm font-bold text-slate-500 uppercase tracking-wider">
                <span>Topics Mastery</span>
                <span className="text-indigo-600">{topicsPercentage}%</span>
              </div>
              <div className="text-sm font-black text-black mt-1">{completedTopicsCount}/{totalTopicsCount} Solved</div>
              <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
                <div className="bg-indigo-600 h-full rounded-full transition-all duration-300" style={{ width: `${topicsPercentage}%` }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Catalog Viewport */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 min-h-0">
        
        {/* Left Side: Topic Navigation Catalog (All topics in a single list) */}
        <div className="lg:col-span-4 flex flex-col space-y-4">
          <div className="glass-panel p-4 rounded-lg border border-slate-200 bg-white flex flex-col space-y-3 shrink-0">
            {/* Search */}
            <div className="relative">
              <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-800" />
              <input
                type="text"
                placeholder="Search aptitude topics..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-950 text-xs focus:outline-none focus:border-indigo-600 transition-colors"
              />
            </div>
          </div>

          {/* Topics List Container - Single Scrollable List */}
          <div className="glass-panel rounded-lg border border-slate-200 bg-white flex-grow overflow-y-auto max-h-[600px] p-2 space-y-1">
            {filteredTopics.map((topic, index) => {
              const isActive = topic.id === activeTopicId;
              const isChecked = !!completedTopics[topic.id];
              return (
                <button
                  key={topic.id}
                  onClick={() => setActiveTopicId(topic.id)}
                  className={`w-full flex items-center justify-between p-3.5 rounded-lg border text-left transition-all duration-200 ${
                    isActive 
                      ? 'bg-indigo-50 border-indigo-200 text-indigo-700 font-bold shadow-sm'
                      : 'bg-white border-transparent hover:bg-slate-50 text-slate-950'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`p-2 rounded-lg border text-xs ${
                      isActive ? 'bg-indigo-100 border-indigo-200 text-indigo-700' : 'bg-slate-50 border-slate-100 text-slate-800'
                    }`}>
                      {index + 1}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold truncate leading-normal">{topic.title}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {isChecked && (
                      <span className="w-4 h-4 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 border border-emerald-200">
                        <Check size={10} strokeWidth={3} />
                      </span>
                    )}
                    <ChevronRight size={12} className={isActive ? 'text-indigo-600 translate-x-0.5' : 'text-slate-400'} />
                  </div>
                </button>
              );
            })}
            {filteredTopics.length === 0 && (
              <p className="text-slate-800 text-xs italic text-center py-6">No matching topics found.</p>
            )}
          </div>
        </div>

        {/* Right Side: Topic Content details */}
        <div className="lg:col-span-8 flex flex-col space-y-4">
          <div className="glass-panel p-4 rounded-lg border border-slate-200 bg-white space-y-4 flex-grow">
            
            {/* Header row */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="space-y-1">
                <h2 className="text-sm font-extrabold text-black pt-1">
                  {activeTopic.title}
                </h2>
              </div>

              {/* Complete toggle checkbox */}
              <button
                onClick={() => toggleTopicCompletion(activeTopic.id)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg border text-sm font-bold transition-all ${
                  completedTopics[activeTopic.id] 
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-600' 
                    : 'bg-slate-50 border-slate-200 text-slate-900 hover:text-black'
                }`}
              >
                <Check size={12} strokeWidth={3} />
                <span>{completedTopics[activeTopic.id] ? 'Completed' : 'Mark Complete'}</span>
              </button>
            </div>

            {/* Formula Block & Tricks */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Formula Panel */}
              <div className="glass-panel p-4 rounded-lg border border-slate-200 bg-slate-50 space-y-3">
                <h4 className="text-sm font-black uppercase text-slate-800 tracking-wider flex items-center gap-1.5">
                  <Calculator size={13} className="text-indigo-600" />
                  <span>Important Formulas</span>
                </h4>
                <ul className="space-y-2">
                  {activeTopic.formulas.map((formula, idx) => (
                    <li key={idx} className="text-black text-xs bg-white p-2.5 rounded-lg border border-slate-200/50 font-sans leading-relaxed text-sm">
                      {formula}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Quick Tricks Panel */}
              <div className="glass-panel p-4 rounded-lg border border-slate-200 bg-slate-50 space-y-3">
                <h4 className="text-sm font-black uppercase text-slate-800 tracking-wider flex items-center gap-1.5">
                  <Sparkles size={13} className="text-indigo-600" />
                  <span>Quick Tricks & Shortcuts</span>
                </h4>
                <ul className="space-y-2.5">
                  {activeTopic.tricks.map((trick, idx) => (
                    <li key={idx} className="text-slate-950 text-xs flex items-start gap-2 leading-relaxed">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0 mt-1.5" />
                      <span>{trick}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* YouTube Video Embed */}
            {activeTopic.videoUrl ? (
              <div className="space-y-3">
                <h4 className="text-sm font-black uppercase text-slate-800 tracking-wider flex items-center gap-1.5">
                  <Play size={13} className="text-indigo-600" />
                  <span>Video Lecture (CareerRide)</span>
                </h4>
                <div className="relative aspect-video w-full rounded-lg overflow-hidden border border-slate-200 shadow-sm bg-slate-50">
                  <iframe
                    src={activeTopic.videoUrl}
                    title={`${activeTopic.title} Lecture`}
                    className="absolute inset-0 w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
            ) : (
              <div className="glass-panel p-4 rounded-lg border border-slate-200/40 bg-slate-50 flex items-center gap-3 text-xs text-slate-900 italic">
                <BookOpen size={16} className="text-indigo-600" />
                <span>No video embed is available for this topic. Refer to the formulas and practice solved MCQs below.</span>
              </div>
            )}

            {/* Solved Questions MCQ Hub */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <div className="flex flex-col space-y-3">
                <h4 className="text-sm font-black uppercase text-slate-800 tracking-wider flex items-center gap-1.5">
                  <HelpCircle size={13} className="text-indigo-600" />
                  <span>Solved Practice Questions (40 Questions)</span>
                </h4>
                
                {/* 1-40 Pagination Grid (Momentum UI styling) */}
                <div className="grid grid-cols-8 sm:grid-cols-10 gap-1.5 bg-slate-50 p-2.5 rounded-lg border border-slate-200 max-h-[120px] overflow-y-auto font-mono">
                  {Array.from({ length: 40 }).map((_, idx) => {
                    const qAns = userAnswers[activeTopicId]?.[idx];
                    const isAnswered = !!qAns;
                    const isCorrect = qAns?.isCorrect;
                    const isActive = activeQuestionIdx === idx;
                    
                    let qBtnStyle = 'bg-white border-slate-200 text-slate-900 hover:bg-slate-100';
                    if (isAnswered) {
                      qBtnStyle = isCorrect 
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-700 font-bold'
                        : 'bg-rose-50 border-rose-300 text-rose-700 font-bold';
                    }
                    if (isActive) {
                      qBtnStyle += ' ring-2 ring-indigo-600 border-indigo-300 font-bold';
                    }
                    
                    return (
                      <button
                        key={idx}
                        onClick={() => {
                          setActiveQuestionIdx(idx);
                          setShowExplanation(!!qAns);
                        }}
                        className={`h-8 rounded-lg border text-sm font-semibold flex items-center justify-center transition-all ${qBtnStyle}`}
                      >
                        {idx + 1}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Selected Question Workspace */}
              {currentQuestion ? (
                <div className="glass-panel p-4 rounded-lg border border-slate-200 bg-slate-50/50 space-y-4 transition-all duration-300 animate-fadeIn">
                  <div className="flex items-center justify-between text-sm font-bold text-slate-500 uppercase tracking-wider">
                    <span>Question {activeQuestionIdx + 1} of 40</span>
                  </div>

                  <p className="text-black text-xs font-semibold leading-relaxed font-sans whitespace-pre-line">
                    {currentQuestion.question}
                  </p>

                  {/* MCQ Options Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {currentQuestion.options.map((option, idx) => {
                      const qAns = userAnswers[activeTopicId]?.[activeQuestionIdx];
                      const isAnswered = !!qAns;
                      const isSelected = qAns?.selectedOption === option;
                      const isCorrect = option === currentQuestion.answer;
                      
                      let btnStyle = 'bg-white border-slate-200 text-slate-950 hover:bg-slate-100 hover:text-black';
                      if (isAnswered) {
                        if (isCorrect) {
                          btnStyle = 'bg-emerald-50 border-emerald-400 text-emerald-700 font-bold';
                        } else if (isSelected) {
                          btnStyle = 'bg-rose-50 border-rose-400 text-rose-700 font-bold';
                        } else {
                          btnStyle = 'bg-white border-slate-100 text-slate-400 opacity-60';
                        }
                      }

                      return (
                        <button
                          key={idx}
                          disabled={isAnswered}
                          onClick={() => handleAnswerClick(option)}
                          className={`p-3 rounded-md border text-left text-sm font-medium transition-all duration-150 flex items-center justify-between ${btnStyle}`}
                        >
                          <span>{option}</span>
                          {isAnswered && isCorrect && <Check size={14} className="text-emerald-600 shrink-0" />}
                          {isAnswered && isSelected && !isCorrect && <X size={14} className="text-rose-600 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>

                  {/* Dynamic Explanation block */}
                  {userAnswers[activeTopicId]?.[activeQuestionIdx] && (
                    <div className="space-y-3 pt-3 border-t border-slate-200/50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          {userAnswers[activeTopicId][activeQuestionIdx].isCorrect ? (
                            <span className="text-emerald-600 text-xs font-bold flex items-center gap-1">
                              <CheckCircle2 size={14} />
                              Correct Answer!
                            </span>
                          ) : (
                            <span className="text-rose-600 text-xs font-bold flex items-center gap-1">
                              <X size={14} />
                              Incorrect. Correct is: {currentQuestion.answer}
                            </span>
                          )}
                        </div>
                        
                        <button
                          onClick={() => setShowExplanation(!showExplanation)}
                          className="text-sm text-indigo-600 font-bold hover:underline flex items-center gap-1"
                        >
                          <span>{showExplanation ? 'Hide Solution' : 'View Step-by-Step Solution'}</span>
                          <ChevronDown size={12} className={`transition-transform duration-200 ${showExplanation ? 'rotate-180' : ''}`} />
                        </button>
                      </div>

                      {showExplanation && (
                        <div className="bg-white p-4 rounded-lg border border-slate-200 text-slate-950 text-xs font-sans whitespace-pre-line leading-relaxed">
                          {currentQuestion.explanation}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Prev/Next Navigation Controls */}
                  <div className="flex items-center justify-between pt-3 border-t border-slate-200/30">
                    <button
                      disabled={activeQuestionIdx === 0}
                      onClick={() => {
                        const prevIdx = activeQuestionIdx - 1;
                        setActiveQuestionIdx(prevIdx);
                        setShowExplanation(!!userAnswers[activeTopicId]?.[prevIdx]);
                      }}
                      className="px-3.5 py-1.5 rounded-lg border border-slate-200 text-sm font-bold text-slate-900 hover:text-black hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-transparent"
                    >
                      Previous Question
                    </button>
                    
                    <button
                      disabled={activeQuestionIdx === 39}
                      onClick={() => {
                        const nextIdx = activeQuestionIdx + 1;
                        setActiveQuestionIdx(nextIdx);
                        setShowExplanation(!!userAnswers[activeTopicId]?.[nextIdx]);
                      }}
                      className="px-4 py-2 rounded-lg text-white bg-indigo-600 hover:bg-indigo-500 text-sm font-bold shadow-md hover:scale-105 active:scale-95 disabled:opacity-40 transition-all"
                    >
                      Next Question
                    </button>
                  </div>

                </div>
              ) : (
                <div className="p-4 text-center text-slate-800 text-xs italic">
                  Loading question data...
                </div>
              )}
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};

export default AptitudePrep;
