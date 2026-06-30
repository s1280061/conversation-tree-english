import type { Story } from "@/lib/types";

/**
 * Seed conversation stories, personalized to the user's profile
 * (Nissan engineer, into AI / autonomous driving, wants a PhD abroad,
 * likes KFC, YouTube, Steam, Tesla).
 *
 * Each story is a complete LINE-style conversation. User lines carry
 * `suggested` answers (beginner / intermediate / advanced) for Practice mode.
 * No AI is needed — everything here is static.
 */
export const stories: Story[] = [
  // ───────────────────────── WEEKEND ─────────────────────────
  {
    id: "wk-youtube",
    topicId: "weekend",
    title: "Watching YouTube",
    title_ja: "YouTubeを見る",
    emoji: "📺",
    difficulty: "beginner",
    summary: "A relaxed weekend of AI and tech videos.",
    summary_ja: "AI・テック動画でのんびり過ごす週末。",
    messages: [
      {
        id: "wk-youtube-1",
        speaker: "ai",
        en: "What do you usually do on weekends?",
        ja: "週末はたいてい何をしていますか？",
      },
      {
        id: "wk-youtube-2",
        speaker: "user",
        en: "I usually relax at home and watch a lot of YouTube.",
        ja: "たいてい家でゆっくりして、YouTubeをたくさん見ます。",
        suggested: {
          beginner: "I watch YouTube.",
          intermediate: "I usually watch YouTube at home.",
          advanced: "I usually relax at home and watch a lot of YouTube.",
        },
      },
      {
        id: "wk-youtube-3",
        speaker: "ai",
        en: "Nice! What kind of videos do you watch?",
        ja: "いいですね！どんな動画を見ますか？",
      },
      {
        id: "wk-youtube-4",
        speaker: "user",
        en: "Mostly AI and technology videos. I like keeping up with new tools.",
        ja: "ほとんどAIやテクノロジーの動画です。新しいツールを追いかけるのが好きなんです。",
        suggested: {
          beginner: "AI videos.",
          intermediate: "Mostly videos about AI and technology.",
          advanced: "Mostly AI and technology videos. I like keeping up with new tools.",
        },
      },
      {
        id: "wk-youtube-5",
        speaker: "ai",
        en: "Who's your favorite YouTuber?",
        ja: "好きなYouTuberは誰ですか？",
      },
      {
        id: "wk-youtube-6",
        speaker: "user",
        en: "Probably MKBHD. His videos are really clear and easy to understand.",
        ja: "たぶんMKBHDです。彼の動画はとても分かりやすいんです。",
        suggested: {
          beginner: "I like MKBHD.",
          intermediate: "My favorite is MKBHD. His videos are easy to understand.",
          advanced: "Probably MKBHD. His videos are really clear and easy to understand.",
        },
      },
      {
        id: "wk-youtube-7",
        speaker: "ai",
        en: "Did you watch anything interesting yesterday?",
        ja: "昨日は何か面白いものを見ましたか？",
      },
      {
        id: "wk-youtube-8",
        speaker: "user",
        en: "Yeah, I watched a video comparing a few new AI models. It was surprisingly fun.",
        ja: "はい、新しいAIモデルを比較する動画を見ました。意外と面白かったです。",
        suggested: {
          beginner: "Yes, an AI video.",
          intermediate: "Yes, I watched a video about new AI models.",
          advanced:
            "Yeah, I watched a video comparing a few new AI models. It was surprisingly fun.",
        },
      },
    ],
  },
  {
    id: "wk-coding",
    topicId: "weekend",
    title: "Weekend Coding",
    title_ja: "週末のコーディング",
    emoji: "👨‍💻",
    difficulty: "intermediate",
    summary: "Building a personal project on a day off.",
    summary_ja: "休日に個人開発を進める話。",
    messages: [
      {
        id: "wk-coding-1",
        speaker: "ai",
        en: "I heard you like building things. Do you code on weekends too?",
        ja: "ものづくりが好きだと聞きました。週末もコードを書くんですか？",
      },
      {
        id: "wk-coding-2",
        speaker: "user",
        en: "Yeah, I often work on personal projects on the weekend.",
        ja: "はい、週末はよく個人プロジェクトに取り組んでいます。",
        suggested: {
          beginner: "Yes, I code on weekends.",
          intermediate: "Yes, I usually work on personal projects.",
          advanced: "Yeah, I often work on personal projects on the weekend.",
        },
      },
      {
        id: "wk-coding-3",
        speaker: "ai",
        en: "What are you building these days?",
        ja: "最近は何を作っているんですか？",
      },
      {
        id: "wk-coding-4",
        speaker: "user",
        en: "Right now I'm building an English learning app with Next.js and TypeScript.",
        ja: "今はNext.jsとTypeScriptで英語学習アプリを作っています。",
        suggested: {
          beginner: "An English app.",
          intermediate: "I'm making an English learning app.",
          advanced: "Right now I'm building an English learning app with Next.js and TypeScript.",
        },
      },
      {
        id: "wk-coding-5",
        speaker: "ai",
        en: "That's cool. What do you enjoy most about coding?",
        ja: "いいですね。コーディングのどんなところが一番好きですか？",
      },
      {
        id: "wk-coding-6",
        speaker: "user",
        en: "I love turning an idea into something real that people can actually use.",
        ja: "アイデアを、人が実際に使える形にできるのが大好きです。",
        suggested: {
          beginner: "I can make real things.",
          intermediate: "I like turning ideas into real apps.",
          advanced: "I love turning an idea into something real that people can actually use.",
        },
      },
      {
        id: "wk-coding-7",
        speaker: "ai",
        en: "Do you usually finish your projects?",
        ja: "プロジェクトはたいてい完成させますか？",
      },
      {
        id: "wk-coding-8",
        speaker: "user",
        en: "Not always, to be honest. But I learn something new from every one.",
        ja: "正直、いつもではないです。でもどれからも新しいことを学べます。",
        suggested: {
          beginner: "Not always.",
          intermediate: "Not always, but I learn a lot.",
          advanced: "Not always, to be honest. But I learn something new from every one.",
        },
      },
    ],
  },
  {
    id: "wk-steam",
    topicId: "weekend",
    title: "Playing on Steam",
    title_ja: "Steamでゲーム",
    emoji: "🎮",
    difficulty: "beginner",
    summary: "Unwinding with a few games online.",
    summary_ja: "オンラインゲームで息抜きする話。",
    messages: [
      {
        id: "wk-steam-1",
        speaker: "ai",
        en: "Do you play any video games?",
        ja: "ゲームはしますか？",
      },
      {
        id: "wk-steam-2",
        speaker: "user",
        en: "Yeah, I mostly play games on Steam to relax.",
        ja: "はい、リラックスするためにだいたいSteamでゲームをします。",
        suggested: {
          beginner: "Yes, on Steam.",
          intermediate: "Yes, I play games on Steam.",
          advanced: "Yeah, I mostly play games on Steam to relax.",
        },
      },
      {
        id: "wk-steam-3",
        speaker: "ai",
        en: "What kind of games do you like?",
        ja: "どんなゲームが好きですか？",
      },
      {
        id: "wk-steam-4",
        speaker: "user",
        en: "I enjoy story-driven games. I like ones that make me think.",
        ja: "ストーリー重視のゲームが好きです。考えさせられるものが好きなんです。",
        suggested: {
          beginner: "Story games.",
          intermediate: "I like games with a good story.",
          advanced: "I enjoy story-driven games. I like ones that make me think.",
        },
      },
      {
        id: "wk-steam-5",
        speaker: "ai",
        en: "Do you play alone or with friends?",
        ja: "一人で遊びますか、友達と遊びますか？",
      },
      {
        id: "wk-steam-6",
        speaker: "user",
        en: "Usually alone. It's a nice way to switch off after a busy week.",
        ja: "たいてい一人です。忙しい一週間のあとに頭を切り替えるのにちょうどいいんです。",
        suggested: {
          beginner: "Alone.",
          intermediate: "Usually alone, to relax.",
          advanced: "Usually alone. It's a nice way to switch off after a busy week.",
        },
      },
    ],
  },
  {
    id: "wk-kfc",
    topicId: "weekend",
    title: "A KFC Habit",
    title_ja: "KFCの習慣",
    emoji: "🍗",
    difficulty: "beginner",
    summary: "Your weekly fried chicken ritual.",
    summary_ja: "毎週のフライドチキンの習慣。",
    messages: [
      {
        id: "wk-kfc-1",
        speaker: "ai",
        en: "Do you have a favorite fast food?",
        ja: "好きなファストフードはありますか？",
      },
      {
        id: "wk-kfc-2",
        speaker: "user",
        en: "Definitely KFC. I eat it about once a week.",
        ja: "間違いなくKFCです。週に1回くらい食べます。",
        suggested: {
          beginner: "I like KFC.",
          intermediate: "KFC. I eat it once a week.",
          advanced: "Definitely KFC. I eat it about once a week.",
        },
      },
      {
        id: "wk-kfc-3",
        speaker: "ai",
        en: "Once a week! What's your favorite menu item?",
        ja: "週1回も！好きなメニューは何ですか？",
      },
      {
        id: "wk-kfc-4",
        speaker: "user",
        en: "The original recipe chicken. I usually get some fries on the side too.",
        ja: "オリジナルチキンです。だいたいポテトも一緒に頼みます。",
        suggested: {
          beginner: "Fried chicken.",
          intermediate: "The original chicken, with fries.",
          advanced: "The original recipe chicken. I usually get some fries on the side too.",
        },
      },
      {
        id: "wk-kfc-5",
        speaker: "ai",
        en: "Why do you like KFC so much?",
        ja: "どうしてそんなにKFCが好きなんですか？",
      },
      {
        id: "wk-kfc-6",
        speaker: "user",
        en: "It's quick, it's tasty, and it's kind of become my little weekend treat.",
        ja: "早いし美味しいし、ちょっとした週末のご褒美になっているんです。",
        suggested: {
          beginner: "It's tasty.",
          intermediate: "It's quick and delicious.",
          advanced: "It's quick, it's tasty, and it's kind of become my little weekend treat.",
        },
      },
    ],
  },

  // ──────────────────────── TECHNOLOGY ────────────────────────
  {
    id: "tc-ai",
    topicId: "technology",
    title: "Why I Love AI",
    title_ja: "AIが好きな理由",
    emoji: "🤖",
    difficulty: "intermediate",
    summary: "How AI fits into your daily life.",
    summary_ja: "日常にAIがどう溶け込んでいるか。",
    messages: [
      {
        id: "tc-ai-1",
        speaker: "ai",
        en: "You seem really into AI. How did that start?",
        ja: "AIにすごく興味があるみたいですね。どうやって始まったんですか？",
      },
      {
        id: "tc-ai-2",
        speaker: "user",
        en: "I've always liked technology, but AI really caught my attention a few years ago.",
        ja: "もともと技術が好きでしたが、数年前にAIに強く惹かれました。",
        suggested: {
          beginner: "I like technology.",
          intermediate: "I've always liked tech, and AI caught my attention.",
          advanced:
            "I've always liked technology, but AI really caught my attention a few years ago.",
        },
      },
      {
        id: "tc-ai-3",
        speaker: "ai",
        en: "How do you use AI in your daily life?",
        ja: "日常生活でAIをどう使っていますか？",
      },
      {
        id: "tc-ai-4",
        speaker: "user",
        en: "Every day, actually — for studying English, writing code, and organizing ideas.",
        ja: "実は毎日です。英語の勉強、コードを書くこと、アイデアの整理に使っています。",
        suggested: {
          beginner: "I use it every day.",
          intermediate: "I use it for studying and coding.",
          advanced: "Every day, actually — for studying English, writing code, and organizing ideas.",
        },
      },
      {
        id: "tc-ai-5",
        speaker: "ai",
        en: "What excites you most about it?",
        ja: "AIの何に一番ワクワクしますか？",
      },
      {
        id: "tc-ai-6",
        speaker: "user",
        en: "How fast it's improving. It feels like the future is arriving sooner than expected.",
        ja: "進化の速さです。思っていたより早く未来が来ている感じがします。",
        suggested: {
          beginner: "It's improving fast.",
          intermediate: "It's improving really quickly.",
          advanced: "How fast it's improving. It feels like the future is arriving sooner than expected.",
        },
      },
    ],
  },
  {
    id: "tc-nissan",
    topicId: "technology",
    title: "Working at Nissan",
    title_ja: "日産での仕事",
    emoji: "🚗",
    difficulty: "advanced",
    summary: "Your job in automotive engineering and self-driving tech.",
    summary_ja: "自動車工学・自動運転に関わる仕事の話。",
    messages: [
      {
        id: "tc-nissan-1",
        speaker: "ai",
        en: "So, what do you do for work?",
        ja: "お仕事は何をされているんですか？",
      },
      {
        id: "tc-nissan-2",
        speaker: "user",
        en: "I'm an engineer at Nissan, working on automotive and autonomous driving technology.",
        ja: "日産のエンジニアで、自動車と自動運転の技術に取り組んでいます。",
        suggested: {
          beginner: "I'm an engineer at Nissan.",
          intermediate: "I work at Nissan as an engineer.",
          advanced:
            "I'm an engineer at Nissan, working on automotive and autonomous driving technology.",
        },
      },
      {
        id: "tc-nissan-3",
        speaker: "ai",
        en: "That sounds fascinating. What's the most interesting part?",
        ja: "面白そうですね。一番面白い部分はどこですか？",
      },
      {
        id: "tc-nissan-4",
        speaker: "user",
        en: "Honestly, computer vision — teaching a car to actually understand what it sees.",
        ja: "正直、コンピュータビジョンです。車が見ているものを本当に理解できるようにすることですね。",
        suggested: {
          beginner: "Computer vision.",
          intermediate: "I like the computer vision part.",
          advanced: "Honestly, computer vision — teaching a car to actually understand what it sees.",
        },
      },
      {
        id: "tc-nissan-5",
        speaker: "ai",
        en: "Do you think fully self-driving cars will be common soon?",
        ja: "完全な自動運転車はすぐに一般的になると思いますか？",
      },
      {
        id: "tc-nissan-6",
        speaker: "user",
        en: "Maybe not everywhere, but I think it'll happen gradually, area by area.",
        ja: "どこでも、ではないかもしれませんが、地域ごとに少しずつ進むと思います。",
        suggested: {
          beginner: "Maybe in the future.",
          intermediate: "Not soon everywhere, but step by step.",
          advanced: "Maybe not everywhere, but I think it'll happen gradually, area by area.",
        },
      },
      {
        id: "tc-nissan-7",
        speaker: "ai",
        en: "Do you enjoy your job?",
        ja: "仕事は楽しいですか？",
      },
      {
        id: "tc-nissan-8",
        speaker: "user",
        en: "I do, but lately I've been thinking about moving more toward research.",
        ja: "楽しいです。でも最近は、もっと研究の方に進みたいと考えています。",
        suggested: {
          beginner: "Yes, I like it.",
          intermediate: "Yes, but I want to do research.",
          advanced: "I do, but lately I've been thinking about moving more toward research.",
        },
      },
    ],
  },
  {
    id: "tc-tesla",
    topicId: "technology",
    title: "Tesla & Elon Musk",
    title_ja: "テスラとイーロン・マスク",
    emoji: "⚡",
    difficulty: "intermediate",
    summary: "Your thoughts on Tesla and big tech visionaries.",
    summary_ja: "テスラや起業家のビジョンについて。",
    messages: [
      {
        id: "tc-tesla-1",
        speaker: "ai",
        en: "I know you're interested in Tesla. What do you find exciting about it?",
        ja: "テスラに興味があるんですよね。どんなところが面白いですか？",
      },
      {
        id: "tc-tesla-2",
        speaker: "user",
        en: "I love how they combine hardware, software, and AI in one product.",
        ja: "ハードウェアとソフトウェアとAIを一つの製品にまとめているところが好きです。",
        suggested: {
          beginner: "I like their cars.",
          intermediate: "I like how they mix software and AI.",
          advanced: "I love how they combine hardware, software, and AI in one product.",
        },
      },
      {
        id: "tc-tesla-3",
        speaker: "ai",
        en: "What do you think about Elon Musk?",
        ja: "イーロン・マスクについてどう思いますか？",
      },
      {
        id: "tc-tesla-4",
        speaker: "user",
        en: "He's controversial, but I admire how ambitiously he thinks about the future.",
        ja: "賛否はありますが、未来について大胆に考えるところは尊敬しています。",
        suggested: {
          beginner: "He is interesting.",
          intermediate: "He's controversial, but very ambitious.",
          advanced: "He's controversial, but I admire how ambitiously he thinks about the future.",
        },
      },
      {
        id: "tc-tesla-5",
        speaker: "ai",
        en: "Would you ever want to work at a company like that?",
        ja: "そういう会社で働いてみたいと思いますか？",
      },
      {
        id: "tc-tesla-6",
        speaker: "user",
        en: "Maybe, but I think I'd rather do research that pushes the whole field forward.",
        ja: "かもしれませんが、分野全体を前に進める研究の方をやりたい気がします。",
        suggested: {
          beginner: "Maybe someday.",
          intermediate: "Maybe, but I prefer research.",
          advanced: "Maybe, but I think I'd rather do research that pushes the whole field forward.",
        },
      },
    ],
  },
  {
    id: "tc-projects",
    topicId: "technology",
    title: "Building AI Apps",
    title_ja: "AIアプリを作る",
    emoji: "🛠️",
    difficulty: "intermediate",
    summary: "The side projects you build with AI.",
    summary_ja: "AIを使った個人開発の話。",
    messages: [
      {
        id: "tc-projects-1",
        speaker: "ai",
        en: "Besides work, do you build your own AI projects?",
        ja: "仕事以外で、自分のAIプロジェクトも作っていますか？",
      },
      {
        id: "tc-projects-2",
        speaker: "user",
        en: "Yes, I build small AI apps on the side. It's how I learn best.",
        ja: "はい、空き時間に小さなAIアプリを作っています。それが一番よく学べる方法なんです。",
        suggested: {
          beginner: "Yes, small apps.",
          intermediate: "Yes, I build small AI apps to learn.",
          advanced: "Yes, I build small AI apps on the side. It's how I learn best.",
        },
      },
      {
        id: "tc-projects-3",
        speaker: "ai",
        en: "What tools do you usually use?",
        ja: "普段はどんなツールを使いますか？",
      },
      {
        id: "tc-projects-4",
        speaker: "user",
        en: "Mostly Python and FastAPI for the backend, and Next.js for the front end.",
        ja: "バックエンドはPythonとFastAPI、フロントエンドはNext.jsが中心です。",
        suggested: {
          beginner: "Python and Next.js.",
          intermediate: "Python, FastAPI, and Next.js.",
          advanced: "Mostly Python and FastAPI for the backend, and Next.js for the front end.",
        },
      },
      {
        id: "tc-projects-5",
        speaker: "ai",
        en: "What's the dream project you'd love to build one day?",
        ja: "いつか作りたい夢のプロジェクトは何ですか？",
      },
      {
        id: "tc-projects-6",
        speaker: "user",
        en: "Something that uses AI to genuinely help people learn faster.",
        ja: "AIを使って、人が本当に速く学べるよう手助けするものを作りたいです。",
        suggested: {
          beginner: "An AI study app.",
          intermediate: "An AI tool that helps people learn.",
          advanced: "Something that uses AI to genuinely help people learn faster.",
        },
      },
    ],
  },

  // ──────────────────── FUTURE & DREAMS ────────────────────
  {
    id: "ft-phd",
    topicId: "future",
    title: "Dreaming of a PhD",
    title_ja: "博士号という夢",
    emoji: "🎓",
    difficulty: "advanced",
    summary: "Why you want to pursue a doctorate.",
    summary_ja: "なぜ博士号を目指すのか。",
    messages: [
      {
        id: "ft-phd-1",
        speaker: "ai",
        en: "You mentioned research before. Are you thinking about a PhD?",
        ja: "さっき研究の話が出ましたね。博士号を考えているんですか？",
      },
      {
        id: "ft-phd-2",
        speaker: "user",
        en: "Yes, I'm seriously considering it. I want to do meaningful research, not just industry work.",
        ja: "はい、真剣に考えています。ただの企業の仕事ではなく、意味のある研究がしたいんです。",
        suggested: {
          beginner: "Yes, I want a PhD.",
          intermediate: "Yes, I want to do real research.",
          advanced:
            "Yes, I'm seriously considering it. I want to do meaningful research, not just industry work.",
        },
      },
      {
        id: "ft-phd-3",
        speaker: "ai",
        en: "What field would you focus on?",
        ja: "どの分野に集中しますか？",
      },
      {
        id: "ft-phd-4",
        speaker: "user",
        en: "Probably AI and computer vision — it connects directly to what I already do.",
        ja: "おそらくAIとコンピュータビジョンです。今やっていることに直結しているので。",
        suggested: {
          beginner: "AI.",
          intermediate: "AI and computer vision.",
          advanced: "Probably AI and computer vision — it connects directly to what I already do.",
        },
      },
      {
        id: "ft-phd-5",
        speaker: "ai",
        en: "Where would you like to study?",
        ja: "どこで学びたいですか？",
      },
      {
        id: "ft-phd-6",
        speaker: "user",
        en: "Ideally in the US, though I'm also looking at programs in Japan and Macau.",
        ja: "理想はアメリカですが、日本やマカオのプログラムも見ています。",
        suggested: {
          beginner: "In the US.",
          intermediate: "Maybe the US, Japan, or Macau.",
          advanced: "Ideally in the US, though I'm also looking at programs in Japan and Macau.",
        },
      },
      {
        id: "ft-phd-7",
        speaker: "ai",
        en: "That's a big step. What worries you the most?",
        ja: "大きな一歩ですね。一番心配なことは何ですか？",
      },
      {
        id: "ft-phd-8",
        speaker: "user",
        en: "Mostly leaving a stable job, but I think the risk is worth it for the dream.",
        ja: "安定した仕事を離れることが一番ですが、夢のためならその価値はあると思います。",
        suggested: {
          beginner: "Leaving my job.",
          intermediate: "Leaving a stable job is scary.",
          advanced: "Mostly leaving a stable job, but I think the risk is worth it for the dream.",
        },
      },
    ],
  },
  {
    id: "ft-researcher",
    topicId: "future",
    title: "Becoming a Researcher",
    title_ja: "研究者になる",
    emoji: "🔬",
    difficulty: "advanced",
    summary: "The kind of impact you hope to make.",
    summary_ja: "どんな影響を残したいか。",
    messages: [
      {
        id: "ft-researcher-1",
        speaker: "ai",
        en: "If everything goes well, where do you see yourself in ten years?",
        ja: "すべて上手くいったら、10年後はどんな自分でいたいですか？",
      },
      {
        id: "ft-researcher-2",
        speaker: "user",
        en: "I'd love to be an AI researcher, working on problems that really matter.",
        ja: "本当に重要な問題に取り組むAI研究者になっていたいです。",
        suggested: {
          beginner: "An AI researcher.",
          intermediate: "I want to be an AI researcher.",
          advanced: "I'd love to be an AI researcher, working on problems that really matter.",
        },
      },
      {
        id: "ft-researcher-3",
        speaker: "ai",
        en: "Why research, rather than staying in industry?",
        ja: "なぜ企業に残るのではなく研究なんですか？",
      },
      {
        id: "ft-researcher-4",
        speaker: "user",
        en: "In research, I can explore deeper questions and create knowledge, not just products.",
        ja: "研究なら、より深い問いを探究できて、製品だけでなく知識を生み出せます。",
        suggested: {
          beginner: "I like deep questions.",
          intermediate: "Research lets me explore deeper ideas.",
          advanced:
            "In research, I can explore deeper questions and create knowledge, not just products.",
        },
      },
      {
        id: "ft-researcher-5",
        speaker: "ai",
        en: "What kind of impact do you hope to have?",
        ja: "どんな影響を残したいですか？",
      },
      {
        id: "ft-researcher-6",
        speaker: "user",
        en: "I want to build technology that genuinely helps society, not just makes money.",
        ja: "お金を稼ぐだけでなく、本当に社会の役に立つ技術を作りたいです。",
        suggested: {
          beginner: "Help society.",
          intermediate: "I want to help society with technology.",
          advanced: "I want to build technology that genuinely helps society, not just makes money.",
        },
      },
    ],
  },
  {
    id: "ft-abroad",
    topicId: "future",
    title: "Studying Abroad",
    title_ja: "海外留学",
    emoji: "🌏",
    difficulty: "intermediate",
    summary: "Why you want to study overseas.",
    summary_ja: "なぜ海外で学びたいのか。",
    messages: [
      {
        id: "ft-abroad-1",
        speaker: "ai",
        en: "Have you ever lived or studied abroad?",
        ja: "海外で暮らしたり勉強したりしたことはありますか？",
      },
      {
        id: "ft-abroad-2",
        speaker: "user",
        en: "Not yet, but I really want to. I've only traveled to the Philippines so far.",
        ja: "まだないんですが、すごくしたいです。今のところフィリピンに行ったことがあるだけです。",
        suggested: {
          beginner: "Not yet.",
          intermediate: "Not yet, but I want to.",
          advanced: "Not yet, but I really want to. I've only traveled to the Philippines so far.",
        },
      },
      {
        id: "ft-abroad-3",
        speaker: "ai",
        en: "Why do you want to study abroad?",
        ja: "なぜ留学したいんですか？",
      },
      {
        id: "ft-abroad-4",
        speaker: "user",
        en: "I want to work with top researchers and become comfortable talking in English.",
        ja: "一流の研究者と一緒に働きたいし、英語で自然に話せるようになりたいんです。",
        suggested: {
          beginner: "To learn English.",
          intermediate: "To work with researchers and use English.",
          advanced: "I want to work with top researchers and become comfortable talking in English.",
        },
      },
      {
        id: "ft-abroad-5",
        speaker: "ai",
        en: "Which country interests you the most?",
        ja: "一番興味のある国はどこですか？",
      },
      {
        id: "ft-abroad-6",
        speaker: "user",
        en: "The US, mainly. That's where a lot of the cutting-edge AI research happens.",
        ja: "主にアメリカです。最先端のAI研究の多くがそこで行われているので。",
        suggested: {
          beginner: "The US.",
          intermediate: "The US, because of AI research.",
          advanced: "The US, mainly. That's where a lot of the cutting-edge AI research happens.",
        },
      },
    ],
  },
];

export const storiesByTopic = (topicId: string) =>
  stories.filter((s) => s.topicId === topicId);

export const storyById = (id: string) => stories.find((s) => s.id === id);
