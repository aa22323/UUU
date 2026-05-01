import React, { Component, useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ShieldCheck, 
  TrendingUp, 
  Clock, 
  ArrowRightLeft, 
  Lock, 
  ExternalLink, 
  ChevronRight,
  ShieldAlert,
  Users,
  LineChart,
  Plus,
  Minus,
  ArrowUpRight,
  ArrowDownLeft,
  Settings,
  History,
  Home,
  Shield,
  Coins,
  ArrowLeft,
  LogOut,
  Copy,
  Check,
  QrCode,
  X,
  User,
  MessageCircle,
  Globe,
  LayoutDashboard,
  CheckCircle,
  XCircle,
  Edit,
  Wallet,
  ClipboardList,
  Newspaper,
  Search
} from "lucide-react";
import { 
  auth, 
  db, 
  loginWithGoogle, 
  loginWithEmail,
  registerWithEmail,
  logout as firebaseLogout, 
  onSnapshot, 
  doc, 
  getDoc, 
  setDoc, 
  Timestamp, 
  serverTimestamp, 
  OperationType, 
  handleFirestoreError,
  query,
  collection,
  orderBy,
  limit,
  writeBatch,
  collectionGroup,
  getDocs,
  where,
  updateDoc
} from './lib/firebase';

const LANGUAGES = [
  { code: 'jp', name: '日本語', flag: 'jp' },
  { code: 'en', name: 'English', flag: 'us' },
  { code: 'tr', name: 'Türkçe', flag: 'tr' },
  { code: 'cn', name: '简体中文', flag: 'cn' },
  { code: 'tw', name: '繁体中文', flag: 'hk' },
  { code: 'kr', name: '한국어', flag: 'kr' },
  { code: 'vn', name: 'Tiếng Việt', flag: 'vn' },
  { code: 'th', name: 'ไทย', flag: 'th' },
  { code: 'id', name: 'Bahasa Indonesia', flag: 'id' },
  { code: 'es', name: 'Español', flag: 'es' },
  { code: 'pt', name: 'Português', flag: 'br' },
  { code: 'ar', name: 'العربية', flag: 'sa' },
  { code: 'ru', name: 'Русский', flag: 'ru' },
  { code: 'hi', name: 'हिन्दी', flag: 'in' },
];

const TRANSLATIONS: Record<string, any> = {
  jp: {
    heroTitle: "「円安・インフレから、\n大切な資産を\n賢く守る。」",
    heroSubtitle: "最新の金融技術（DeFi）を活用した、\n米ドル建て資産保全プラン。",
    yieldSim: "収益シミュレーション",
    annualYield: "期待収益率（年率）",
    oneMonth: "1ヶ月後予測",
    oneYear: "1年後期待",
    startNow: "次世代運用を開始",
    dashboard: "ダッシュボードへ",
    authLogin: "新規登録 / ログイン",
    totalBalance: "預入資産残高",
    principalTotal: "内、元本合計",
    newUserNotification: "預入が完了すると計算が開始されます",
    assets: "資産管理",
    history: "履歴",
    invite: "招待",
    settings: "設定",
    authenticated: "認証済み",
    authSuccess: "認証成功",
    login: "ログイン",
    register: "新規登録",
    welcome: "KIZUNA DIGITAL ASSET DEFENSE へようこそ",
    email: "メールアドレス",
    password: "パスワード",
    inviteCode: "招待コード (任意)",
    withdraw: "出金",
    deposit: "預入",
    address: "出金先アドレス",
    confirmWithdraw: "出金を確定する",
    cancel: "キャンセル",
    fee: "申請手数料",
    free: "無料 (キャンペーン中)",
    arrival: "推定到着時間",
    within24h: "24時間以内",
    depositTitle: "追加預入 (Deposit)",
    depositSubtitle: "USDT 資産の追加",
    withdrawalNetwork: "出金ネットワーク",
    depositAmount: "預入金額 (USDT)",
    withdrawalAmount: "出金額 (USDT)",
    withdrawalAddress: "出金先アドレス",
    available: "利用可能",
    max: "最大 (MAX)",
    checkingNetwork: "ネットワーク確認中...",
    blockchainConfirm: "Blockchain confirmation in progress",
    confirmDeposit: "振込完了を確認",
    qrCodeDesc: "預入専用アドレス",
    minThreshold: "最低預入額: 1,000 JPY相当",
    memoWarning: "※実際のお取引では、上記アドレスにUSDTを送金してください。現在はデモモードです。",
    home: "ホーム",
    historyTitle: "資産履歴",
    security: "セキュリティ",
    walletLinked: "ウォレット連携",
    logout: "ログアウト",
    yesterdayYield: "昨日の収益",
    totalYield: "累計収益",
    currentApy: "現在のAPY",
    referralProgress: "報酬獲得進捗",
    lineInvite: "LINEで友だちを招待",
    inviteSuccessList: "招待成功リスト",
    totalReward: "合計報酬",
    faqBankQ: "なぜ日本の銀行より利息が高いのですか？",
    faqBankA: "従来の銀行が抱える膨大な店舗維持費や人件費を、スマートコントラクトによってゼロに削減したからです。",
    faqRiskQ: "資金が引き出せなくなるリスクはありませんか？",
    faqRiskA: "当プラットフォームは「非預託型」を採用しており、資金は世界最大のDeFiプロトコル「Aave」に預けられます。",
    faqPlatformQ: "もしプラットフォームが閉鎖されたらどうなりますか？",
    faqPlatformA: "資産はブロックチェーン上のスマートコントラクトに記録されています。直接回収も可能です。",
    representative: "代表 〇〇",
    repDesc: "KUD 設立準備責任者",
    auditTitle: "Aave 監査済みプロトコル",
    auditDesc: "TVL 1.5兆円相当以上の実績。厳格なコード監査をクリア。",
    withdrawFreeTitle: "24時間 自由な出金",
    withdrawFreeDesc: "ロックアップなし。必要な時にいつでも資産を引き出せます。",
    readMsg: "準備室からのメッセージを読む",
    closeMsg: "メッセージを閉じる",
    welcomeTitle: "「最先端の金融技術（DeFi）を日本の友人や家族にも届けたい。私たちは、あなたの『絆』を守る盾となります。」",
    step1Title: "国内取引所でUSDT準備",
    step1Desc: "日本の取引所を通じて、米ドル連動型資産(USDT)を自身で確保します。",
    step2Title: "スマートコントラクト接続",
    step2Desc: "DeFiプロトコル「Aave」へ直接アクセスする入口を提供します。",
    step3Title: "非預託型（Non-custodial）",
    step3Desc: "権利は常に利用者に。私たちは資金を一切お預かりしません。",
    stepLabel: "透明な仕組み",
    repLabel: "代表メッセージ",
    safetyLabel: "安全性と実績",
    faqLabel: "よくある質問",
    demoDeposit: "デモ資金を入金 (10,000 USDT)",
    smallTest: "少額テスト (1,240 USDT)",
    addDepositTest: "追加入金テスト (5,000 USDT)",
    addDeposit: "追加預入",
    withdrawApply: "出金申請",
    withdrawNote: "※最短即日、ご指定のウォレットへ払い戻し可能です",
    assetDist: "資産分布",
    audited: "監査済み (Audited)",
    campaignNote: "手数料無料キャンペーン中。ご自身の取引所ウォレットへ最短即日返金いたします。",
    recentEarnings: "最近の収益入帳",
    viewAll: "全て見る",
    historyEmpty: "運用が開始されるとこちらに履歴が表示されます",
    earningRecords: "収益記録",
    capitalChanges: "資金変動",
    noEarnings: "収益データがありません。初回の自動計算までしばらくお待ちください。",
    noCapital: "資金変動の記録はありません。",
    goBack: "戻る",
    accountSecurity: "アカウントセキュリティ",
    loginPassword: "ログインパスワード",
    passNote: "セキュリティ維持のため、90日ごとのパスワード変更を推奨しています。",
    changePass: "パスワードを変更する",
    twoFactor: "二段階認証 (2FA)",
    googleAuthLinked: "Google Authenticator連携済み。",
    twoFactorNote: "※万が一ログインパスワードが盗難された場合でも、お手元のスマートフォンに表示される認証コードがなければ、資金移動は一切不可能です。",
    linkedWallet: "出金先ウォレット連携",
    usdtAddress: "USDT受取用アドレス (ERC-20 / TRC-20)",
    walletNote: "※Bitflyer、Coincheck等、国内取引所のUSDT受取アドレスを正しく入力してください。",
    addressLock: "アドレス・ロック (Address Lock)",
    lockNote: "不正出金を防止するため、アドレスの変更・更新には「48時間」の冷却期間が必要となります。",
    settingsAdmin: "管理設定 (Settings)",
    lineLinked: "LINE連携済み",
    googleSecure: "Googleセキュア連携",
    emailMember: "メールアドレス会員",
    notificationSettings: "通知設定",
    systemAlerts: "収益通知・システムアラート",
    terms: "利用規約 / 免責事項",
    inviteFriends: "友達を招待 (Invite)",
    inviteCodeLabel: "专属邀请码 / Referral Code",
    inviteNote: "このコードを友達の登録時に入力してもらうことで、両者に報酬が付与されます。",
    inviteRemaining: "あと{n}人の招待で利率+0.5%アップ",
    depositTipNew: "「まずは1,000円分から。少額で安全性をお試しください。」",
    depositTipOld: "「追加預入も1,000円から。いつでも安心・気軽な運用を。」",
    accrued: "収益入帳",
    googleLogin: "Googleでログイン",
    lineLogin: "LINEで登録 / ログイン",
    inviteCodeOptional: "招待コード (任意)",
    alreadyAccount: "既にアカウントをお持ちの方",
    createNewAccount: "新しくアカウントを作成する",
    withdrawPlaceholder: "あなたの {network} アドレスを入力",
    securityFooter: "ご登録いただいた情報は、最新の暗号化技術により厳重に守られます",
    ctaTitle: "防衛準備室の情報を取得",
    ctaButton: "無料でアカウント開設",
    lineCta: "LINE公式連携で開始",
    notSet: "未設定",
    interestEarning: "利息収益",
    initialDeposit: "初回預入 (Initial Deposit)",
    protocolPool: "Aave Protocol Pool",
    joined: "JOINED",
    noFriendsYet: "まだ招待した友達はいません。\n友達を誘って収益率を最大化しましょう。",
    back: "戻る",
    assetProtectionStatus: "資産保護ステータス",
    scVerifiedTitle: "Smart Contract: Verified",
    scVerifiedDesc: "イーサリアム・メインネット上のAaveプロトコルへの直接的なアクセスが検証されています。",
    auditedBy: "Audited by SigmaPrime / Trail of Bits",
    auditProof: "世界最高水準のセキュリティ監査機関によって、技術の完全性と安全性が証明されています。",
    close: "閉じる",
    logoutConfirmTitle: "安全にログアウトしますか？",
    logoutConfirmDesc: "セッションを終了し、紹介ページへ戻ります。\n資産は引き続きスマートコントラクトによって安全に保護されています。",
    logoutConfirmButton: "ログアウトを確定する",
    emailValidationErr: "メールアドレスとパスワードを入力してください",
    authFailedErr: "認証に失敗しました。内容を確認してください。",
    authWrongPassErr: "メールアドレスまたはパスワードが正しくありません。",
    authEmailInUseErr: "このメールアドレスは既に登録されています。",
    authWeakPassErr: "パスワードは6文字以上で入力してください。",
    authInvalidEmailErr: "有効なメールアドレスを入力してください。",
    systemLoading: "システム読み込み中...",
    or: "OR",
    status: "ステータス",
    pending: "保留中",
    emailPlaceholder: "address@example.com",
    passwordPlaceholder: "••••••••",
    invitePlaceholder: "KIZUNA-XXXX",
    amountPlaceholder: "0.00",
    capitalRatio: "元本比率",
    growthRatio: "収益比率",
    version: "バージョン",
    progress: "進捗",
    adminPanel: "管理パネル",
    memberManagement: "会員管理",
    audit: "審査",
    systemSettings: "システム設定",
    adminSummary: "管理概要",
    interestRate: "利率 (APY)",
    approve: "承認",
    reject: "却下",
    saveSettings: "設定を保存",
    customerService: "カスタマーサポート",
    platformWallet: "運営受取用ウォレット",
    'adminAuthTitle': "管理者認証",
    'adminAuthDesc': "管理パネルにアクセスするには、6桁のセキュリティコードを入力してください。",
    'adminAuthPlaceholder': "コードを入力",
    'adminAuthError': "コードが正しくありません。再試行してください。",
    'adminCodeSetting': "管理パネル・アクセスコード",
    'adminCodeNote': "※管理パネルへの二次認証コードを設定します（6桁推奨）。",
    'verify': "認証する",
    usdDefense: "USD DEFENSE",
    prepLab: "PREP LAB",
    assetDefenseLabel: "Digital Asset Defense",
    liveIndicator: "LIVE",
    verAlphaCode: "VER 0.8.2 ALPHA EDITION",
    allRightsReserved: "ALL RIGHTS RESERVED",
    kizunaLogoFull: "Kizuna Digital Asset Defense Lab",
    repNameSato: "佐藤 健二郎",
    repTitleSato: "KIZUNA 設立準備責任者",
    usdtBadge: "USDT",
    adminPanelTitle: "KIZUNA ADMIN",
    exitAdminBtn: "退出后台",
    contentMgmtSystem: "コンテンツ管理システム",
    superAdmin: "特権管理者",
    totalUsersAdmin: "総ユーザー数",
    totalDepositsAdmin: "総預入額 (USDT)",
    totalEarningsDistAdmin: "収益配分合計 (USDT)",
    pendingAuditsAdmin: "待機中の審査",
    recentActiveUsers: "最近のアクティブユーザー",
    sysStatus: "システム稼働状況",
    opNormal: "正常に稼働中",
    opNormalDesc: "すべてのブロックチェーン同期サービスは正常に動作しています。",
    pendingReview: "審査待ち",
    noPendingRequests: "未処理の申請はありません",
    depositAction: "預入",
    withdrawAction: "出金",
    approveBtn: "承認",
    rejectBtn: "拒否",
    userListTitle: "ユーザーリスト",
    searchUserPlaceholder: "ユーザーを検索...",
    userInfoHeader: "ユーザー情報",
    principalHeader: "本金 (USDT)",
    earningsHeader: "収益 (USDT)",
    apyHeader: "利率 (APY)",
    roleHeader: "権限",
    actionHeader: "操作",
    sysConfigTitle: "システムパラメータ設定",
    customerServiceUrlLabel: "カスタマーサポートURL (Telegram/Line)",
    customerServiceQrLabel: "カスタマーサポートQRコード",
    platformWalletTrc20Label: "プラットフォーム受取アドレス (TRC20)",
    qrCodeTrc20Label: "TRC20 受取用QR",
    platformWalletErc20Label: "プラットフォーム受取アドレス (ERC20)",
    qrCodeErc20Label: "ERC20 受取用QR",
    editUserTitle: "ユーザー編集",
    userNameLabel: "ユーザー名",
    customApyLabel: "個別APY設定 (%)",
    setAccountRole: "アカウント権限",
    saveChangesBtn: "変更を保存",
    fixedRate: "固定",
    sysDefault: "システムデフォルト",
    interestEarningLabel: "利息収益",
    initialDepositLabel: "初回預入",
    inviteLineMsg: "【KIZUNA PREP LAB】次世代USDT運用で資産を守る。今なら招待コード入力で利率アップ！\n招待コード：{code}\n参加はこちら：{url}"
  },
  en: {
    heroTitle: "Defending Your Assets\nfrom Inflation\nIntelligently.",
    heroSubtitle: "A US Dollar-based preservation plan\nleveraging cutting-edge DeFi technology.",
    yieldSim: "Yield Simulation",
    annualYield: "Expected Annual Yield",
    oneMonth: "1 Month Forecast",
    oneYear: "1 Year Expectation",
    startNow: "Start Next-Gen Yield",
    dashboard: "Go to Dashboard",
    authLogin: "Register / Login",
    totalBalance: "Total Balance",
    principalTotal: "Total Principal",
    newUserNotification: "Calculations begin after deposit",
    assets: "Assets",
    history: "History",
    invite: "Invite",
    settings: "Settings",
    authenticated: "Verified",
    authSuccess: "Verified Successfully",
    login: "Login",
    register: "Register",
    welcome: "Welcome to KIZUNA DIGITAL ASSET DEFENSE",
    email: "Email Address",
    password: "Password",
    inviteCode: "Invite Code (Optional)",
    withdraw: "Withdraw",
    deposit: "Deposit",
    address: "Withdrawal Address",
    confirmWithdraw: "Confirm Withdrawal",
    cancel: "Cancel",
    fee: "Service Fee",
    free: "Free (Campaign)",
    arrival: "Estimated Arrival",
    within24h: "Within 24h",
    depositTitle: "Add Deposit",
    depositSubtitle: "Add USDT Assets",
    withdrawalNetwork: "Withdrawal Network",
    depositAmount: "Deposit Amount (USDT)",
    withdrawalAmount: "Withdrawal Amount (USDT)",
    withdrawalAddress: "Withdrawal Address",
    available: "Available",
    max: "MAX",
    checkingNetwork: "Checking network...",
    blockchainConfirm: "Blockchain confirmation in progress",
    confirmDeposit: "Confirm Transfer",
    qrCodeDesc: "Deposit Address",
    minThreshold: "Min threshold: 1,000 JPY equivalent",
    memoWarning: "Note: In real transactions, please send USDT to the above address. This is currently in demo mode.",
    home: "Home",
    historyTitle: "Asset History",
    security: "Security",
    walletLinked: "Wallet Linked",
    logout: "Logout",
    yesterdayYield: "Yesterday's Yield",
    totalYield: "Total Yield",
    currentApy: "Current APY",
    referralProgress: "Referral Progress",
    lineInvite: "Invite via LINE",
    inviteSuccessList: "Success List",
    totalReward: "Total Reward",
    faqBankQ: "Why is the yield higher than Japanese banks?",
    faqBankA: "By using smart contracts, we eliminate the huge maintenance and labor costs of traditional banks.",
    faqRiskQ: "Is there a risk of not being able to withdraw?",
    faqRiskA: "We use a non-custodial model. Assets are held in Aave, the world's largest DeFi protocol.",
    faqPlatformQ: "What happens if the platform closes?",
    faqPlatformA: "Assets are recorded on the blockchain and can be recovered directly.",
    representative: "CEO Name",
    repDesc: "KUD Planning Lead",
    auditTitle: "Aave Audited Protocol",
    auditDesc: "Over $10B TVL track record. Passed rigorous audits.",
    withdrawFreeTitle: "24/7 Free Withdrawals",
    withdrawFreeDesc: "No lock-ups. Withdraw your assets whenever you need.",
    readMsg: "Read message from prep room",
    closeMsg: "Close message",
    welcomeTitle: "Bringing DeFi to friends and family in Japan. We are the shield protecting your 'Kizuna'.",
    ctaTitle: "Get Defense Info",
    ctaButton: "Create Account (Free)",
    lineCta: "Start with LINE",
    securityFooter: "Your info is strictly protected by advanced encryption.",
    step1Title: "Prepare USDT locally",
    step1Desc: "Secure US Dollar-linked assets (USDT) through your local exchange.",
    step2Title: "Connect Smart Contract",
    step2Desc: "We provide an entry point to directly access the Aave DeFi protocol.",
    step3Title: "Non-custodial Mode",
    step3Desc: "Rights always remain with the user. We never hold your funds.",
    stepLabel: "Mechanism",
    repLabel: "Message",
    safetyLabel: "Safety",
    faqLabel: "FAQ",
    demoDeposit: "Deposit Demo (10,000 USDT)",
    smallTest: "Small Test (1,240 USDT)",
    addDepositTest: "Add Deposit Test (5,000 USDT)",
    addDeposit: "Add Deposit",
    withdrawApply: "Apply Withdrawal",
    withdrawNote: "* Refund to specified wallet possible within same day.",
    assetDist: "Distribution",
    audited: "Audited",
    campaignNote: "Free fee campaign active. Refunds to your wallet as fast as today.",
    recentEarnings: "Recent Earnings",
    viewAll: "View All",
    historyEmpty: "History will appear here once operations begin.",
    earningRecords: "Earning Records",
    capitalChanges: "Capital Changes",
    noEarnings: "No earning data. Please wait for first auto-calculation.",
    noCapital: "No capital movement records.",
    goBack: "Back",
    notSet: 'Not Set',
    liveStatus: 'PROTOCOL LIVE',
    interestEarning: 'Interest Accrual & Compounding',
    initialDeposit: 'System Initial Capital Injection',
    protocolPool: 'Cross-Lending Protocol Pool',
    joined: 'Joined',
    noFriendsYet: 'No invites yet. Share your code to start earning bonuses!',
    assetProtectionStatus: 'Asset Protection Status',
    scVerifiedTitle: 'SC Verified',
    scVerifiedDesc: 'All transactions verified by Smart Contract protocol.',
    auditedBy: 'Audited by',
    auditProof: 'Audit Proof',
    close: 'Close',
    logoutConfirmTitle: 'Logout',
    logoutConfirmDesc: 'Are you sure you want to sign out?',
    logoutConfirmButton: 'Confirm Logout',
    emailValidationErr: 'Please enter a valid email and password.',
    authFailedErr: 'Authentication failed. Please try again.',
    authWrongPassErr: 'Incorrect email or password.',
    authEmailInUseErr: 'This email is already in use.',
    authWeakPassErr: 'Password must be at least 6 characters.',
    authInvalidEmailErr: 'Please enter a valid email.',
    systemLoading: 'System Loading...',
    or: 'OR',
    status: 'Status',
    pending: 'Pending',
    emailPlaceholder: 'address@example.com',
    passwordPlaceholder: '••••••••',
    invitePlaceholder: 'KIZUNA-XXXX',
    amountPlaceholder: '0.00',
    capitalRatio: 'Capital Ratio',
    growthRatio: 'Growth Ratio',
    version: 'Ver 2.1.0',
    progress: 'Progress',
    accountSecurity: "Account Security",
    loginPassword: "Login Password",
    passNote: "Password change recommended every 90 days for security.",
    changePass: "Change Password",
    twoFactor: "Two-Factor (2FA)",
    googleAuthLinked: "Google Authenticator Linked.",
    twoFactorNote: "* Even if password is stolen, funds cannot move without 2FA code.",
    linkedWallet: "Linked Wallet",
    usdtAddress: "Withdrawal Address (ERC-20 / TRC-20)",
    walletNote: "* Enter your USDT withdrawal address correctly.",
    addressLock: "Address Lock",
    lockNote: "48h cooling period required for address updates to prevent unauthorized withdrawals.",
    settingsAdmin: "Settings",
    lineLinked: "LINE Linked",
    googleSecure: "Google Secure",
    emailMember: "Email Member",
    notificationSettings: "Notifications",
    systemAlerts: "Earnings & System Alerts",
    terms: "Terms / Disclaimer",
    inviteFriends: "Invite Friends",
    inviteCodeLabel: "Referral Code",
    inviteNote: "Enter this code at registration to grant rewards to both parties.",
    inviteRemaining: "{n} more invites to increase APY by +0.5%",
    depositTipNew: "Start with as little as 1,000 JPY. Test the safety with a small amount.",
    depositTipOld: "Additional deposits from 1,000 JPY. Safe and flexible anytime.",
    accrued: "Accrued",
    googleLogin: "Log in with Google",
    lineLogin: "Register / Log in with LINE",
    inviteCodeOptional: "Referral Code (Optional)",
    alreadyAccount: "Already have an account?",
    createNewAccount: "Create a new account",
    withdrawPlaceholder: "Enter your {network} address",
    adminPanel: "Admin Panel",
    memberManagement: "Member Management",
    audit: "Audit",
    systemSettings: "Settings",
    adminSummary: "Summary",
    interestRate: "APY",
    approve: "Approve",
    reject: "Reject",
    saveSettings: "Save Settings",
    customerService: "Customer Support",
    platformWallet: "Platform Wallet",
    supportQrTitle: "Customer Support QR",
    selectLanguage: "SELECT LANGUAGE",
    'adminAuthTitle': "Admin Verification",
    'adminAuthDesc': "Please enter the 6-digit security code to access the Admin Panel.",
    'adminAuthPlaceholder': "Enter Code",
    'adminAuthError': "Incorrect code. Please try again.",
    'adminCodeSetting': "Admin Access Code",
    'adminCodeNote': "* Secondary verification code for Admin Panel (6 digits recommended).",
    'verify': "Verify",
    usdDefense: "USD DEFENSE",
    prepLab: "PREP LAB",
    assetDefenseLabel: "Digital Asset Defense",
    liveIndicator: "LIVE",
    verAlphaCode: "VER 0.8.2 ALPHA EDITION",
    allRightsReserved: "ALL RIGHTS RESERVED",
    kizunaLogoFull: "Kizuna Digital Asset Defense Lab",
    repNameSato: "Kenjiro Sato",
    repTitleSato: "KIZUNA PREP LAB Representative",
    usdtBadge: "USDT",
    adminPanelTitle: "KIZUNA ADMIN",
    exitAdminBtn: "Exit Admin",
    contentMgmtSystem: "Content Management System",
    superAdmin: "Super Admin",
    totalUsersAdmin: "Total Users",
    totalDepositsAdmin: "Total Deposits (USDT)",
    totalEarningsDistAdmin: "Earnings Distributed (USDT)",
    pendingAuditsAdmin: "Pending Audits",
    recentActiveUsers: "Recent Active Users",
    sysStatus: "System Status",
    opNormal: "Operational",
    opNormalDesc: "All blockchain sync services are currently operational.",
    pendingReview: "Pending Review",
    noPendingRequests: "No pending requests",
    depositAction: "Deposit",
    withdrawAction: "Withdrawal",
    approveBtn: "Approve",
    rejectBtn: "Reject",
    userListTitle: "User List",
    searchUserPlaceholder: "Search users...",
    userInfoHeader: "User Info",
    principalHeader: "Principal (USDT)",
    earningsHeader: "Earnings (USDT)",
    apyHeader: "Yield (APY)",
    roleHeader: "Role",
    actionHeader: "Actions",
    sysConfigTitle: "System Configuration",
    customerServiceUrlLabel: "Support URL (Telegram/Line)",
    customerServiceQrLabel: "Support QR Code",
    platformWalletTrc20Label: "Platform Wallet (TRC20)",
    qrCodeTrc20Label: "TRC20 QR Code",
    platformWalletErc20Label: "Platform Wallet (ERC20)",
    qrCodeErc20Label: "ERC20 QR Code",
    editUserTitle: "Edit User",
    userNameLabel: "User Name",
    customApyLabel: "Custom APY (%)",
    setAccountRole: "Account Role",
    saveChangesBtn: "Save Changes",
    fixedRate: "Fixed",
    sysDefault: "System Default",
    withdrawHistory: "Withdrawal History",
    statusPending: "Pending",
    statusCompleted: "Completed",
    statusFailed: "Rejected",
    initialDepositLabel: "Initial Deposit",
    inviteLineMsg: "【KIZUNA PREP LAB】Protect assets with next-gen USDT yield. Use my invite code for a yield boost!\nInvite Code: {code}\nJoin here: {url}"
  },
  tr: {
    heroTitle: "Varlıklarınızı\nEnflasyondan\nZekice Koruyun.",
    heroSubtitle: "En son DeFi teknolojisinden yararlanan,\nABD Doları bazlı bir koruma planı.",
    yieldSim: "Getiri Simülasyonu",
    annualYield: "Beklenen Yıllık Getiri",
    oneMonth: "1 Ay Sonrası",
    oneYear: "1 Yıl Sonrası",
    startNow: "Simülasyonu Başlat",
    dashboard: "Panele Git",
    authLogin: "Kayıt Ol / Giriş Yap",
    totalBalance: "Toplam Bakiye",
    principalTotal: "Ana Para Toplamı",
    newUserNotification: "Yatırım tamamlandığında hesaplama başlar",
    assets: "Varlıklar",
    history: "Geçmiş",
    invite: "Davet Et",
    settings: "Ayarlar",
    authenticated: "Doğrulandı",
    authSuccess: "Başarıyla Doğrulandı",
    login: "Giriş Yap",
    register: "Kayıt Ol",
    welcome: "KIZUNA'ya Hoş Geldiniz",
    email: "E-posta Adresi",
    password: "Şifre",
    inviteCode: "Davet Kodu (Opsiyonel)",
    withdraw: "Para Çek",
    deposit: "Para Yatır",
    address: "Cüzdan Adresi",
    confirmWithdraw: "Çekimi Onayla",
    cancel: "İptal",
    fee: "İşlem Ücreti",
    free: "Ücretsiz (Kampanya)",
    arrival: "Tahmini Varış",
    within24h: "24 Saat İçinde",
    depositTitle: "Yatırım Yap",
    depositSubtitle: "USDT Varlığı Ekle",
    withdrawalNetwork: "Çekim Ağı",
    depositAmount: "Yatırım Tutarı (USDT)",
    withdrawalAmount: "Çekim Tutarı (USDT)",
    withdrawalAddress: "Çekim Adresi",
    available: "Kullanılabilir",
    max: "MAKS",
    checkingNetwork: "Ağ kontrol ediliyor...",
    blockchainConfirm: "Blockchain onayı bekleniyor",
    confirmDeposit: "Transferi Onayla",
    qrCodeDesc: "Yatırım Adresi",
    minThreshold: "Min limit: 1.000 JPY eşdeğeri",
    memoWarning: "Not: Gerçek işlemlerde lütfen yukarıdaki adrese USDT gönderin. Bu bir demo modudur.",
    home: "Ana Sayfa",
    historyTitle: "Varlık Geçmişi",
    security: "Güvenlik",
    walletLinked: "Cüzdan Bağlı",
    logout: "Çıkış Yap",
    yesterdayYield: "Dünkü Getiri",
    totalYield: "Toplam Getiri",
    currentApy: "Güncel APY",
    referralProgress: "Referans İlerlemesi",
    lineInvite: "LINE ile Davet Et",
    inviteSuccessList: "Başarı Listesi",
    totalReward: "Toplam Ödül",
    faqBankQ: "Neden bankalardan daha yüksek getiri sağlıyor?",
    faqBankA: "Akıllı sözleşmeler kullanarak geleneksel bankaların büyük maliyetlerini ortadan kaldırıyoruz.",
    faqRiskQ: "Para çekememe riski var mı?",
    faqRiskA: "Varlıklar dünyanın en büyük DeFi protokolü olan Aave'de tutulur, kontrol sizdedir.",
    faqPlatformQ: "Platform kapanırsa ne olur?",
    faqPlatformA: "Varlıklar blockchain'e kaydedilir ve doğrudan geri alınabilir.",
    representative: "CEO Adı",
    repDesc: "KUD Planlama Sorumlusu",
    auditTitle: "Aave Denetlenmiş Protokol",
    auditDesc: "10 Milyar Doların üzerinde TVL. Sıkı denetimlerden geçmiştir.",
    withdrawFreeTitle: "7/24 Ücretsiz Çekim",
    withdrawFreeDesc: "Kilitlenme yok. İhtiyacınız olduğunda varlıklarınızı çekin.",
    readMsg: "Hazırlık odasından mesaj oku",
    closeMsg: "Mesajı kapat",
    welcomeTitle: "DeFi'yi Japonya'daki dostlarımıza taşıyoruz. Sizin 'Kizuna'nızı koruyan kalkan biziz.",
    supportQrTitle: "Müşteri Destek QR",
    platformWallet: "Platform Cüzdanı",
    customerService: "Müşteri Hizmetleri",
    saveSettings: "Ayarları Kaydet",
    close: "Kapat",
    selectLanguage: "DİL SEÇİN",
    'adminAuthTitle': "Yönetici Doğrulaması",
    'adminAuthDesc': "Yönetici Paneline erişmek için lütfen 6 haneli güvenlik kodunu girin.",
    'adminAuthPlaceholder': "Kodu Girin",
    'adminAuthError': "Hatalı kod. Lütfen tekrar deneyin.",
    'adminCodeSetting': "Yönetici Erişim Kodu",
    'adminCodeNote': "* Yönetici Paneli için ikincil doğrulama kodu (6 hane önerilir).",
    'verify': "Doğrula"
  },
  cn: {
    heroTitle: "「抵御日元贬值与通胀，\n睿智守护\n您的重要资产。」",
    heroSubtitle: "运用尖端金融技术（DeFi），\n以美元计价的资产保全方案。",
    yieldSim: "收益模拟",
    annualYield: "预期年化收益",
    oneMonth: "1个月后预测",
    oneYear: "1年后期待",
    startNow: "开始新一代资管",
    dashboard: "前往个人中心",
    authLogin: "立即注册 / 登录",
    totalBalance: "总资产余额",
    principalTotal: "其中本金合计",
    newUserNotification: "入金完成后将开始计算收益",
    assets: "资产管理",
    history: "历史记录",
    invite: "邀请中心",
    settings: "个人设置",
    authenticated: "已认证",
    authSuccess: "认证成功",
    login: "登录",
    register: "立即注册",
    welcome: "欢迎来到 KIZUNA DIGITAL ASSET DEFENSE",
    email: "电子邮箱",
    password: "登录密码",
    inviteCode: "邀请码 (选填)",
    withdraw: "申请出金",
    deposit: "立即充值",
    address: "收款地址",
    confirmWithdraw: "确认申请出金",
    cancel: "返回",
    fee: "手续费",
    free: "当前免费",
    arrival: "预计到账时间",
    within24h: "24小时内",
    depositTitle: "充值资产 (USDT)",
    depositSubtitle: "增加 USDT 资产配置",
    withdrawalNetwork: "选择出金网络",
    depositAmount: "充值金额 (USDT)",
    withdrawalAmount: "申请出金金额 (USDT)",
    withdrawalAddress: "提现收款地址",
    available: "可提现额度",
    max: "全部 (MAX)",
    checkingNetwork: "正在确认网络状态...",
    blockchainConfirm: "区块链确认中",
    confirmDeposit: "确认已完成转账",
    qrCodeDesc: "个人充值专属地址",
    minThreshold: "最低充值限额: 1,000 JPY 等值",
    memoWarning: "注意：在实际交易中，请向上述地址发送 USDT。当前处于演示模式。",
    home: "首页",
    historyTitle: "资产流水",
    security: "安全中心",
    walletLinked: "钱包绑定",
    logout: "退出登录",
    yesterdayYield: "昨日净收益",
    totalYield: "累计净收益",
    currentApy: "当前年化",
    referralProgress: "邀请奖励进度",
    lineInvite: "一键分享至 LINE",
    inviteSuccessList: "成功邀请名单",
    totalReward: "累计获得奖励",
    faqBankQ: "为什么收益比日本银行高得多？",
    faqBankA: "通过智能合约自动化，我们消除了传统银行巨额的网店维护和人力成本。",
    faqRiskQ: "是否存在无法提现的风险？",
    faqRiskA: "我们采用非托管模式，资产存放在全球最大的 DeFi 协议 Aave 中。",
    faqPlatformQ: "如果平台关闭了怎么办？",
    faqPlatformA: "资产记录在区块链上，即使平台关闭，您也可以直接通过链上找回。",
    representative: "代表 〇〇",
    repDesc: "KUD 设立准备责任人",
    auditTitle: "Aave 审计协议",
    auditDesc: "TVL 超过百亿美元，通过全球顶级安披机构审计。",
    withdrawFreeTitle: "24小时自由提现",
    withdrawFreeDesc: "无锁定期，随时地根据需要提取您的资产。",
    readMsg: "阅读来自准备室的致辞",
    closeMsg: "关闭致辞",
    supportQrTitle: "联系客服二维码",
    welcomeTitle: "将最先进的 DeFi 技术带给日本的每一位亲友。我们将成为守护您『羁绊』的坚实护盾。",
    step1Title: "国内交易所准备USDT",
    step1Desc: "通过日本交易所账户，自主配置挂钩美元的数字资产 (USDT)。",
    step2Title: "连接智能合约",
    step2Desc: "提供直接接入全球顶级 DeFi 协议「Aave」的安全入口。",
    step3Title: "非托管模式",
    step3Desc: "资产所有权始终归用户所有，平台不接触或存储您的任何资金。",
    stepLabel: "透明运行机制",
    repLabel: "来自筹备室的致辞",
    safetyLabel: "安全架构",
    faqLabel: "常见问题解答",
    withdrawPlaceholder: "请输入您的 {network} 地址",
    notSet: "未设置",
    interestEarning: "利息收益",
    initialDeposit: "首次充值 (Initial Deposit)",
    protocolPool: "Aave 协议池",
    joined: "已加入",
    noFriendsYet: "暂无邀请记录。\n邀请好友即可大幅提升年化收益率。",
    back: "返回",
    assetProtectionStatus: "资产安全性验证",
    scVerifiedTitle: "智能合约：已验证",
    scVerifiedDesc: "通过以太坊主网直接访问 Aave 协议的权限已获得验证。",
    auditedBy: "审计机构：SigmaPrime / Trail of Bits",
    auditProof: "通过全球顶级安全审计机构的技术完整性与安全性验证。",
    close: "确认关闭",
    logoutConfirmTitle: "确定要退出登录吗？",
    logoutConfirmDesc: "退出后将返回介绍页面。\n您的资产依然由区块链智能合约安全守护，不受任何影响。",
    logoutConfirmButton: "确认退出ログイン",
    emailValidationErr: "请输入邮箱地址和密码",
    authFailedErr: "身份验证失败，请检查输入内容。",
    authWrongPassErr: "邮箱地址或密码错误。",
    authEmailInUseErr: "该邮箱地址已被注册。",
    authWeakPassErr: "密码长度至少需要6位。",
    authInvalidEmailErr: "请输入有效的邮箱地址。",
    systemLoading: "系统加载中...",
    or: "或",
    status: "状态",
    pending: "处理中",
    emailPlaceholder: "address@example.com",
    passwordPlaceholder: "••••••••",
    invitePlaceholder: "KIZUNA-XXXX",
    amountPlaceholder: "0.00",
    capitalRatio: "本金占比",
    growthRatio: "收益占比",
    version: "版本",
    progress: "进度",
    adminPanel: "管理后台",
    memberManagement: "会员管理",
    audit: "审核",
    systemSettings: "系统设置",
    adminSummary: "管理概览",
    interestRate: "利率 (APY)",
    approve: "通过",
    reject: "拒绝",
    saveSettings: "保存设置",
    customerService: "客服组件",
    platformWallet: "平台收款地址",
    selectLanguage: "选择语言",
    'adminAuthTitle': "管理员身份验证",
    'adminAuthDesc': "进入管理后台需要二次验证，请输入 6 位安全代码。",
    'adminAuthPlaceholder': "请输入安全代码",
    'adminAuthError': "安全代码错误，请重试。",
    'adminCodeSetting': "管理后台访问代码",
    'adminCodeNote': "* 设置进入管理后台的二次验证代码（建议 6 位数字）。",
    'verify': "验证进入",
    usdDefense: "USD DEFENSE",
    prepLab: "PREP LAB",
    assetDefenseLabel: "数字资产防御",
    liveIndicator: "LIVE",
    verAlphaCode: "VER 0.8.2 ALPHA EDITION",
    allRightsReserved: "ALL RIGHTS RESERVED",
    kizunaLogoFull: "KIZUNA 数字资产防御实验室",
    repNameSato: "佐藤 健二郎",
    repTitleSato: "KIZUNA 筹备室代表",
    usdtBadge: "USDT",
    adminPanelTitle: "KIZUNA ADMIN",
    exitAdminBtn: "退出后台",
    contentMgmtSystem: "内容管理系统",
    superAdmin: "超级管理员",
    totalUsersAdmin: "总用户数",
    totalDepositsAdmin: "总充值额 (USDT)",
    totalEarningsDistAdmin: "总收益发放 (USDT)",
    pendingAuditsAdmin: "待处理审核",
    recentActiveUsers: "最近活跃用户",
    sysStatus: "系统运行状态",
    opNormal: "运行正常",
    opNormalDesc: "所有区块链同步服务目前均处于正常运行状态。",
    pendingReview: "审核中",
    noPendingRequests: "暂无待处理请求",
    depositAction: "充值",
    withdrawAction: "提现",
    approveBtn: "批准",
    rejectBtn: "拒绝",
    userListTitle: "用户列表",
    searchUserPlaceholder: "搜索用户...",
    userInfoHeader: "用户信息",
    principalHeader: "本金 (USDT)",
    earningsHeader: "收益 (USDT)",
    apyHeader: "利率 (APY)",
    roleHeader: "角色",
    actionHeader: "操作",
    sysConfigTitle: "系统参数配置",
    customerServiceUrlLabel: "客服链接 (Telegram/Line)",
    customerServiceQrLabel: "客服 QR 二维码",
    platformWalletTrc20Label: "平台收款地址 (TRC20)",
    qrCodeTrc20Label: "TRC20 收款二维码",
    platformWalletErc20Label: "平台收款地址 (ERC20)",
    qrCodeErc20Label: "ERC20 收款二维码",
    editUserTitle: "编辑用户",
    userNameLabel: "用户名",
    customApyLabel: "定制 APY (%)",
    setAccountRole: "账户角色",
    saveChangesBtn: "保存修改",
    fixedRate: "固定",
    sysDefault: "系统默认",
    withdrawHistory: "提现历史",
    statusPending: "处理中",
    statusCompleted: "已完成",
    statusFailed: "已驳回",
    initialDepositLabel: "首次充值",
    inviteLineMsg: "【KIZUNA PREP LAB】通过下一代 USDT 收益保护资产。使用我的邀请码即可提升收益率！\n邀请码：{code}\n点击加入：{url}"
  },
  tw: {
    heroTitle: "「抵禦日元貶值與通脹，\n睿智守護\n您的重要資產。」",
    heroSubtitle: "運用尖端金融技術（DeFi），\n以美元計價的資產保全方案。",
    yieldSim: "收益模擬",
    annualYield: "預期年化收益",
    oneMonth: "1個月後預測",
    oneYear: "1年後期待",
    startNow: "開始新一代資管",
    dashboard: "前往個人中心",
    authLogin: "立即註冊 / 登錄",
    totalBalance: "總資產餘額",
    principalTotal: "其中本金合計",
    newUserNotification: "入金完成後將開始計算收益",
    assets: "資產管理",
    history: "歷史記錄",
    invite: "邀請中心",
    settings: "個人設置",
    authenticated: "已認證",
    authSuccess: "認證成功",
    login: "登錄",
    register: "立即註冊",
    welcome: "歡迎來到 KIZUNA DIGITAL ASSET DEFENSE",
    email: "電子郵箱",
    password: "登錄密碼",
    inviteCode: "邀請碼 (選填)",
    withdraw: "申請出金",
    deposit: "立即充值",
    address: "收款地址",
    confirmWithdraw: "確認申請出金",
    cancel: "返回",
    fee: "手續費",
    free: "當前免費",
    arrival: "預計到帳時間",
    within24h: "24小時內",
    depositTitle: "充值資產 (USDT)",
    depositSubtitle: "增加 USDT 資產配置",
    withdrawalNetwork: "選擇出金網絡",
    depositAmount: "充值金額 (USDT)",
    withdrawalAmount: "申請出金金額 (USDT)",
    withdrawalAddress: "提現收款地址",
    available: "可提現額度",
    max: "全部 (MAX)",
    checkingNetwork: "正在確認網絡狀態...",
    blockchainConfirm: "區塊鏈確認中",
    confirmDeposit: "確認已完成轉帳",
    qrCodeDesc: "個人充值專屬地址",
    minThreshold: "最低充值限額: 1,000 JPY 等值",
    memoWarning: "注意：在實際交易中，請向上述地址發送 USDT。當前處於演示模式。",
    home: "首頁",
    historyTitle: "資產流水",
    security: "安全中心",
    walletLinked: "錢包綁定",
    logout: "退出登錄",
    yesterdayYield: "昨日淨收益",
    totalYield: "累計淨收益",
    currentApy: "當前年化",
    referralProgress: "邀請獎勵進度",
    lineInvite: "一鍵分享至 LINE",
    inviteSuccessList: "成功邀請名單",
    totalReward: "累計獲得獎勵",
    faqBankQ: "為什麼收益比日本銀行高得多？",
    faqBankA: "通過智能合約自動化，我們消除了傳統銀行巨額的網店維護和人力成本。",
    faqRiskQ: "是否存在無法提現的風險？",
    faqRiskA: "我們採用非託管模式，資產存放在全球最大的 DeFi 協議 Aave 中。",
    faqPlatformQ: "如果平台關閉了怎麼辦？",
    faqPlatformA: "資產記錄在區塊鏈上，即使平台關閉，您也可以直接通過鏈上找回。",
    representative: "代表 〇〇",
    repDesc: "KUD 設立準備責任人",
    auditTitle: "Aave 審計協議",
    auditDesc: "TVL 超過百億美元，通過全球頂級安披機構審計。",
    withdrawFreeTitle: "24小時自由提現",
    withdrawFreeDesc: "無鎖定期，隨時地根據需要提取您的資產。",
    readMsg: "閱讀來自準備室的致辭",
    closeMsg: "關閉致辭",
    welcomeTitle: "將最先進的 DeFi 技術帶給日本的每一位親友。我們將成為守護您『羈絆』的堅實護盾。",
    stepLabel: "透明運行機制",
    repLabel: "來自籌備室的致辭",
    safetyLabel: "安全架構",
    faqLabel: "常見問題解答",
    withdrawPlaceholder: "請輸入您的 {network} 地址",
    notSet: "未設置",
    interestEarning: "利息收益",
    initialDeposit: "首次充值 (Initial Deposit)",
    protocolPool: "Aave 協議池",
    joined: "已加入",
    noFriendsYet: "暫無邀請記錄。\n邀請好友即可大幅提升年化收益率。",
    back: "返回",
    assetProtectionStatus: "資產安全性驗證",
    scVerifiedTitle: "智能合約：已驗證",
    scVerifiedDesc: "通過以太坊主網直接訪問 Aave 協議的權限已獲得驗證。",
    auditedBy: "審計機構：SigmaPrime / Trail of Bits",
    auditProof: "通過全球頂級安全審計機構的技术完整性與安全性驗證。",
    close: "確認關閉",
    logoutConfirmTitle: "確定要退出登錄嗎？",
    logoutConfirmDesc: "退出後將返回介紹頁面。\n您的資產依然由區塊鏈智能合約安全守護，不受任何影響。",
    logoutConfirmButton: "確認退出ログイン",
    emailValidationErr: "請輸入郵箱地址和密碼",
    authFailedErr: "身份驗證失敗，請檢查輸入內容。",
    authWrongPassErr: "郵箱地址或密碼錯誤。",
    authEmailInUseErr: "該郵箱地址已被註冊。",
    authWeakPassErr: "密碼長度至少需要6位。",
    authInvalidEmailErr: "請輸入有效的郵箱地址。",
    systemLoading: "系統加載中...",
    or: "或",
    status: "狀態",
    pending: "處理中",
    emailPlaceholder: "address@example.com",
    passwordPlaceholder: "••••••••",
    invitePlaceholder: "KIZUNA-XXXX",
    amountPlaceholder: "0.00",
    capitalRatio: "本金佔比",
    growthRatio: "收益佔比",
    version: "版本",
    progress: "進度",
    selectLanguage: "選擇語言",
    'adminAuthTitle': "管理員身份驗證",
    'adminAuthDesc': "進入管理後台需要二次驗證，請輸入 6 位安全代碼。",
    'adminAuthPlaceholder': "請輸入安全代碼",
    'adminAuthError': "安全代碼錯誤，請重試。",
    'adminCodeSetting': "管理後台訪問代碼",
    'adminCodeNote': "* 設置進入管理後台的二次驗證代碼（建議 6 位數字）。",
    'verify': "驗證進入"
  },
  kr: {
    heroTitle: "「엔저·인플레이션으로부터,\n소중한 자산을\n현명하게 지키다.」",
    heroSubtitle: "최신 금융 기술(DeFi)을 활용한,\n미달러화 자산 보전 플랜.",
    yieldSim: "수익 시뮬레이션",
    annualYield: "기대 수익률 (연간)",
    oneMonth: "1개월 후 예측",
    oneYear: "1년 후 기대",
    startNow: "차세대 운용 시작",
    dashboard: "대시보드로 이동",
    authLogin: "신규 등록 / 로그인",
    totalBalance: "예치 자산 잔액",
    principalTotal: "원금 합계",
    newUserNotification: "예치가 완료되면 계산이 시작됩니다",
    assets: "자산 관리",
    history: "내역",
    invite: "초대",
    settings: "설정",
    authenticated: "인증됨",
    authSuccess: "인증 성공",
    login: "로그인",
    register: "신규 등록",
    welcome: "KIZUNA DIGITAL ASSET DEFENSE에 오신 것을 환영합니다",
    email: "이메일 주소",
    password: "비밀번호",
    inviteCode: "초대 코드 (선택 사항)",
    withdraw: "출금",
    deposit: "입금",
    address: "출금 주소",
    confirmWithdraw: "출금 확정",
    cancel: "취소",
    fee: "신청 수수료",
    free: "무료 (캠페인 중)",
    arrival: "예상 도착 시간",
    within24h: "24시간 이내",
    depositTitle: "추가 입금 (Deposit)",
    depositSubtitle: "USDT 자산 추가",
    withdrawalNetwork: "출금 네트워크",
    depositAmount: "입금 금액 (USDT)",
    withdrawalAmount: "출금 금액 (USDT)",
    withdrawalAddress: "출금 주소",
    available: "이용 가능",
    max: "최대 (MAX)",
    checkingNetwork: "네트워크 확인 중...",
    blockchainConfirm: "블록체인 확인 진행 중",
    confirmDeposit: "송금 완료 확인",
    qrCodeDesc: "입금 전용 주소",
    minThreshold: "최소 입금액: 1,000 JPY 상당",
    memoWarning: "※ 실제 거래 시 위 주소로 USDT를 송금하십시오. 현재는 데모 모드입니다.",
    home: "홈",
    historyTitle: "자산 내역",
    security: "보안",
    walletLinked: "지갑 연동",
    logout: "로그아웃",
    yesterdayYield: "어제의 수익",
    totalYield: "누적 수익",
    currentApy: "현재 APY",
    referralProgress: "보상 획득 진행도",
    lineInvite: "LINE으로 친구 초대",
    inviteSuccessList: "초대 성공 리스트",
    totalReward: "합계 보상",
    faqBankQ: "왜 일본 은행보다 이율이 높나요?",
    faqBankA: "기존 은행이 부담하는 막대한 점포 유지비와 인건비를 스마트 컨트랙트를 통해 제로로 줄였기 때문입니다.",
    faqRiskQ: "자금을 인출할 수 없게 될 리스크는 없나요?",
    faqRiskA: "당사 플랫폼은 '비수탁형'을 채택하여 자금은 세계 최대 DeFi 프로토콜인 'Aave'에 예치됩니다.",
    faqPlatformQ: "플랫폼이 폐쇄되면 어떻게 되나요?",
    faqPlatformA: "자산은 블록체인 상의 스마트 컨트랙트에 기록되어 있습니다. 직접 회수도 가능합니다.",
    representative: "대표 OOO",
    repDesc: "KUD 설립 준비 책임자",
    auditTitle: "Aave 감사 완료 프로토콜",
    auditDesc: "TVL 1.5조 엔 상당 이상의 실적. 엄격한 코드 감사를 통과.",
    withdrawFreeTitle: "24시간 자유로운 출금",
    withdrawFreeDesc: "락업 없음. 필요할 때 언제든지 자산을 인출할 수 있습니다.",
    readMsg: "준비실 메시지 읽기",
    closeMsg: "메시지 닫기",
    welcomeTitle: "「최첨단 금융 기술(DeFi)을 한국의 친구와 가족에게도 전하고 싶습니다. 우리는 당신의 '인연(Kizuna)'을 지키는 방패가 되겠습니다.」",
    step1Title: "국내 거래소에서 USDT 준비",
    step1Desc: "거래소를 통해 미달러 연동 자산(USDT)을 직접 확보합니다.",
    step2Title: "스마트 컨트랙트 연결",
    step2Desc: "DeFi 프로토콜 'Aave'에 직접 액세스하는 입구를 제공합니다.",
    step3Title: "비수탁형 (Non-custodial)",
    step3Desc: "권리는 항상 이용자에게. 당사는 자금을 일절 보관하지 않습니다.",
    stepLabel: "투명한 메커니즘",
    repLabel: "대표 인사말",
    safetyLabel: "보안 아키텍처",
    faqLabel: "자주 묻는 질문",
    ctaTitle: "방위 준비 정보 받기",
    ctaButton: "계정 개설하기 (무료)",
    lineCta: "LINE 공식 연동으로 시작",
    securityFooter: "등록하신 정보는 최신 암호화 기술로 엄격히 보호됩니다",
    demoDeposit: "데모 자금 입금 (10,000 USDT)",
    smallTest: "소액 테스트 (1,240 USDT)",
    addDepositTest: "추가 입금 테스트 (5,000 USDT)",
    addDeposit: "추가 예치",
    withdrawApply: "출금 신청",
    withdrawNote: "※ 최단 당일, 지정하신 지갑으로 환불 가능합니다",
    assetDist: "자산 분포",
    audited: "감사 완료 (Audited)",
    campaignNote: "수수료 무료 캠페인 중. 본인의 거래소 지갑으로 최단 당일 환급해 드립니다.",
    recentEarnings: "최근 수익 입금",
    viewAll: "전체 보기",
    historyEmpty: "운용이 시작되면 이곳에 내역이 표시됩니다",
    earningRecords: "수익 기록",
    capitalChanges: "자금 변동",
    noEarnings: "수익 데이터가 없습니다. 첫 자동 계산까지 잠시 기다려 주십시오.",
    noCapital: "자금 변동 기록이 없습니다.",
    goBack: "뒤로",
    accountSecurity: "계정 보안",
    loginPassword: "로그인 비밀번호",
    passNote: "보안 유지를 위해 90일마다 비밀번호를 변경하는 것을 권장합니다.",
    changePass: "비밀번호 변경하기",
    twoFactor: "2단계 인증 (2FA)",
    googleAuthLinked: "Google Authenticator 연동됨.",
    twoFactorNote: "※ 만일 로그인 비밀번호가 도난당하더라도, 본인의 스마트폰에 표시되는 인증 코드가 없으면 자금 이동이 불가능합니다.",
    linkedWallet: "출금 지갑 연동",
    usdtAddress: "USDT 수령용 주소 (ERC-20 / TRC-20)",
    walletNote: "※ 국내외 거래소의 USDT 수령 주소를 정확히 입력해 주십시오.",
    addressLock: "주소 잠금 (Address Lock)",
    lockNote: "부정 출금을 방지하기 위해 주소 변경 시 48시간의 냉각 기간이 필요합니다.",
    settingsAdmin: "관리 설정 (Settings)",
    lineLinked: "LINE 연동됨",
    googleSecure: "Google 보안 연동",
    emailMember: "이메일 회원",
    notificationSettings: "알림 설정",
    systemAlerts: "수익 알림 · 시스템 알람",
    terms: "이용 약관 / 면책 사항",
    inviteFriends: "친구 초대 (Invite)",
    inviteCodeLabel: "전용 초대 코드 / Referral Code",
    inviteNote: "이 코드를 친구가 등록할 때 입력하면 양측 모두에게 보상이 지급됩니다.",
    inviteRemaining: "앞으로 {n}명 초대 시 이율 +0.5% 상승",
    depositTipNew: "「우선 1,000엔 상당부터. 소액으로 안전성을 테스트해 보십시오.」",
    depositTipOld: "「추가 예치도 1,000엔부터. 언제든지 안심하고 부담 없는 운용을.」",
    accrued: "수익 발생",
    googleLogin: "Google로 로그인",
    lineLogin: "LINE으로 등록 / 로그인",
    inviteCodeOptional: "초대 코드 (선택 사항)",
    alreadyAccount: "이미 계정이 있으신가요?",
    createNewAccount: "새 계정 만들기",
    withdrawPlaceholder: "{network} 주소를 입력하세요",
    notSet: "미설정",
    interestEarning: "이자 수익",
    initialDeposit: "초기 예치 (Initial Deposit)",
    protocolPool: "Aave Protocol Pool",
    joined: "가입함",
    noFriendsYet: "아직 초대된 친구가 없습니다.\n친구를 초대하고 수익률을 최대화해 보세요.",
    back: "뒤로",
    assetProtectionStatus: "자산 보호 상태",
    scVerifiedTitle: "Smart Contract: Verified",
    scVerifiedDesc: "이더리움 메인넷 상의 Aave 프로토콜에 대한 직접적인 접근이 검증되었습니다.",
    auditedBy: "Audited by SigmaPrime / Trail of Bits",
    auditProof: "세계 최고 수준의 보안 감사 기관을 통해 기술적 무결성과 안전성이 증명되었습니다.",
    close: "닫기",
    logoutConfirmTitle: "안전하게 로그아웃하시겠습니까?",
    logoutConfirmDesc: "세션이 종료되며 소개 페이지로 이동합니다.\n자산은 스마트 컨트랙트에 의해 계속해서 안전하게 보호됩니다.",
    logoutConfirmButton: "로그아웃 확정",
    emailValidationErr: "이메일 주소와 비밀번호를 입력해 주십시오",
    authFailedErr: "인증에 실패했습니다. 내용을 확인해 주십시오.",
    authWrongPassErr: "이메일 또는 비밀번호가 올바르지 않습니다.",
    authEmailInUseErr: "이미 등록된 이메일 주소입니다.",
    authWeakPassErr: "비밀번호는 6자리 이상으로 입력해 주십시오.",
    authInvalidEmailErr: "유효한 이메일 주소를 입력해 주십시오.",
    systemLoading: "시스템 로딩 중...",
    or: "또는",
    status: "상태",
    pending: "대기 중",
    emailPlaceholder: "address@example.com",
    passwordPlaceholder: "••••••••",
    invitePlaceholder: "KIZUNA-XXXX",
    amountPlaceholder: "0.00",
    capitalRatio: "원본 비중",
    growthRatio: "수익 비중",
    version: "버전",
    progress: "진행도",
    adminPanel: "관리 패널",
    memberManagement: "회원 관리",
    audit: "심사",
    systemSettings: "시스템 설정",
    adminSummary: "관리 개요",
    interestRate: "이율 (APY)",
    approve: "승인",
    reject: "거절",
    saveSettings: "설정 저장",
    customerService: "고객 지원",
    platformWallet: "운영용 지갑",
    'adminAuthTitle': "관리자 인증",
    'adminAuthDesc': "관리자 패널에 접속하려면 6자리 보안 코드를 입력하십시오.",
    'adminAuthPlaceholder': "코드 입력",
    'adminAuthError': "코드가 올바르지 않습니다. 다시 시도하십시오.",
    'adminCodeSetting': "관리자 접속 코드",
    'adminCodeNote': "* 관리자 패널 보조 인증 코드 (6자리 권장).",
    'verify': "인증"
  },
  ru: {
    heroTitle: "Защитите свои активы от инфляции с умом.",
    heroSubtitle: "План сохранения активов в долларах США с использованием передовых технологий DeFi.",
    yieldSim: "Симуляция доходности",
    annualYield: "Ожидаемая годовая доходность",
    oneMonth: "Прогноз на 1 месяц",
    oneYear: "Ожидание на 1 год",
    startNow: "Начать доходность нового поколения",
    dashboard: "Перейти в панель управления",
    authLogin: "Регистрация / Вход",
    totalBalance: "Общий баланс",
    principalTotal: "Общая основная сумма",
    newUserNotification: "Расчеты начинаются после депозита",
    assets: "Активы",
    history: "История",
    invite: "Пригласить",
    settings: "Настройки",
    authenticated: "Проверено",
    authSuccess: "Успешно проверено",
    login: "Войти",
    register: "Зарегистрироваться",
    welcome: "Добро пожаловать в KIZUNA DIGITAL ASSET DEFENSE",
    email: "Адрес электронной почты",
    password: "Пароль",
    inviteCode: "Код приглашения (необязательно)",
    withdraw: "Вывести",
    deposit: "Внести",
    address: "Адрес вывода",
    confirmWithdraw: "Подтвердить вывод",
    cancel: "Отмена",
    fee: "Комиссия за обслуживание",
    free: "Бесплатно (Кампания)",
    arrival: "Ориентировочное время прибытия",
    within24h: "В течение 24 часов",
    depositTitle: "Добавить депозит",
    depositSubtitle: "Добавить активы USDT",
    withdrawalNetwork: "Сеть вывода",
    depositAmount: "Сумма депозита (USDT)",
    withdrawalAmount: "Сумма вывода (USDT)",
    withdrawalAddress: "Адрес вывода",
    available: "Доступно",
    max: "МАКС.",
    checkingNetwork: "Проверка сети...",
    blockchainConfirm: "Подтверждение блокчейна в процессе",
    confirmDeposit: "Подтвердить перевод",
    qrCodeDesc: "Адрес депозита",
    minThreshold: "Минимальный порог: эквивалент 1000 JPY",
    memoWarning: "Примечание: В реальных транзакциях, пожалуйста, отправьте USDT на указанный выше адрес. В настоящее время это демо-режим.",
    home: "Главная",
    historyTitle: "История активов",
    security: "Безопасность",
    walletLinked: "Привязанный кошелек",
    logout: "Выйти",
    yesterdayYield: "Вчерашняя доходность",
    totalYield: "Общая доходность",
    currentApy: "Текущая годовая процентная ставка",
    referralProgress: "Прогресс рефералов",
    lineInvite: "Пригласить через LINE",
    inviteSuccessList: "Список успешных приглашений",
    totalReward: "Общая награда",
    faqBankQ: "Почему доходность выше, чем в японских банках?",
    faqBankA: "Используя смарт-контракты, мы устраняем огромные расходы на содержание и рабочую силу традиционных банков.",
    faqRiskQ: "Существует ли риск невозможности вывода средств?",
    faqRiskA: "Мы используем модель без хранения. Активы хранятся в Aave, крупнейшем в мире протоколе DeFi.",
    faqPlatformQ: "Что произойдет, если платформа закроется?",
    faqPlatformA: "Активы записываются в блокчейн и могут быть восстановлены напрямую.",
    representative: "Имя генерального директора",
    repDesc: "Руководитель отдела планирования KUD",
    auditTitle: "Аудированный протокол Aave",
    auditDesc: "Более 10 миллиардов долларов TVL. Прошел строгие аудиты.",
    withdrawFreeTitle: "Круглосуточные бесплатные выводы",
    withdrawFreeDesc: "Без блокировок. Выводите свои активы, когда вам нужно.",
    readMsg: "Прочитать сообщение из комнаты подготовки",
    closeMsg: "Закрыть сообщение",
    welcomeTitle: "Привносим DeFi друзьям и семье в Японии. Мы - щит, защищающий вашу 'Кизуну'.",
    ctaTitle: "Получить информацию о подготовке к обороне",
    ctaButton: "Открыть счет (бесплатно)",
    lineCta: "Начать с официальной интеграцией LINE",
    securityFooter: "Ваша информация строго защищена передовыми технологиями шифрования",
    'adminAuthTitle': "Проверка администратора",
    'adminAuthDesc': "Введите 6-значный код безопасности для доступа к панели администратора.",
    'adminAuthPlaceholder': "Введите код",
    'adminAuthError': "Неверный код. Пожалуйста, попробуйте еще раз.",
    'adminCodeSetting': "Код доступа администратора",
    'adminCodeNote': "* Дополнительный код подтверждения для панели администратора (рекомендуется 6 цифр).",
    'verify': "Проверить"
  },
  hi: {
    heroTitle: "अपनी संपत्ति को\nमुद्रास्फीति से\nचतुराई से बचाएं।",
    heroSubtitle: "अत्याधुनिक DeFi तकनीक का लाभ उठाते हुए,\nएक अमेरिकी डॉलर आधारित संरक्षण योजना।",
    dashboard: "डैशबोर्ड पर जाएं",
    authLogin: "रजिस्टर / लॉगइन",
    totalBalance: "कुल शेष",
    principalTotal: "कुल मूलधन",
    assets: "संपत्ति",
    history: "इतिहास",
    invite: "आमंत्रित करें",
    settings: "सेटिंग्स",
    login: "लॉगइन",
    register: "रजिस्टर",
    withdraw: "निकासी",
    deposit: "जमा",
    confirmDeposit: "स्थानांतरण की पुष्टि करें",
    home: "होम",
    logout: "लॉगआउट",
    supportQrTitle: "ग्राहक सहायता QR",
    close: "बंद करें",
    selectLanguage: "भाषा चुनें",
    'adminAuthTitle': "एडमिन सत्यापन",
    'adminAuthDesc': "एडमिन पैनल तक पहुंचने के लिए कृपया 6 अंकों का सुरक्षा कोड दर्ज करें।",
    'adminAuthPlaceholder': "कोड दर्ज करें",
    'adminAuthError': "गलत कोड। कृपया पुनः प्रयास करें।",
    'adminCodeSetting': "एडमिन एक्सेस कोड",
    'adminCodeNote': "* एडमिन पैनल के लिए माध्यमिक सत्यापन कोड (6 अंकों की सिफारिश)।",
    'verify': "सत्यापित करें",
    historyTitle: "संपत्ति इतिहास",
    earningRecords: "आय रिकॉर्ड",
    capitalChanges: "पूंजी परिवर्तन",
    noEarnings: "कोई आय डेटा नहीं। कृपया पहली गणना तक प्रतीक्षा करें।",
    noCapital: "कोई पूंजी संचलन रिकॉर्ड नहीं।",
    withdrawApply: "निकासी आवेदन",
    addDeposit: "जमा जोड़ें",
    recentEarnings: "हाल की आय",
    viewAll: "सभी देखें",
    accrued: "अर्जित",
    usdDefense: "USD DEFENSE",
    prepLab: "PREP LAB",
    assetDefenseLabel: "डिजिटल संपत्ति रक्षा",
    liveIndicator: "LIVE",
    verAlphaCode: "VER 0.8.2 ALPHA EDITION",
    allRightsReserved: "सर्वाधिकार सुरक्षित",
    kizunaLogoFull: "Kizuna डिजिटल एसेट डिफेंस लैब",
    repNameSato: "केंजीरो सातो",
    repTitleSato: "KIZUNA तैयारी कक्ष प्रतिनिधि",
    usdtBadge: "USDT",
    adminPanelTitle: "KIZUNA ADMIN",
    exitAdminBtn: "एडमिन पैनल से बाहर निकलें",
    contentMgmtSystem: "सामग्री प्रबंधन प्रणाली",
    superAdmin: "सुपर एडमिन",
    totalUsersAdmin: "कुल उपयोगकर्ता",
    totalDepositsAdmin: "कुल जमा (USDT)",
    totalEarningsDistAdmin: "कुल वितरित आय (USDT)",
    pendingAuditsAdmin: "लंबित ऑडिट",
    recentActiveUsers: "हाल के सक्रिय उपयोगकर्ता",
    sysStatus: "सिस्टम की स्थिति",
    opNormal: "सामान्य संचालन",
    opNormalDesc: "सभी ब्लॉकचेन सिंक सेवाएं वर्तमान में चालू हैं।",
    pendingReview: "समीक्षा लंबित",
    noPendingRequests: "कोई लंबित अनुरोध नहीं",
    depositAction: "जमा",
    withdrawAction: "निकासी",
    approveBtn: "स्वीकार करें",
    rejectBtn: "अस्वीकार करें",
    userListTitle: "उपयोगकर्ता सूची",
    searchUserPlaceholder: "उपयोगकर्ता खोजें...",
    userInfoHeader: "उपयोगकर्ता जानकारी",
    principalHeader: "मूलधन (USDT)",
    earningsHeader: "आय (USDT)",
    apyHeader: "पैदावार (APY)",
    roleHeader: "भूमिका",
    actionHeader: "कार्रवाई",
    sysConfigTitle: "सिस्टम कॉन्फ़िगरेशन",
    customerServiceUrlLabel: "सपोर्ट URL (Telegram/Line)",
    customerServiceQrLabel: "सपोर्ट QR कोड",
    platformWalletTrc20Label: "प्लेटफ़ॉर्म वॉलेट (TRC20)",
    qrCodeTrc20Label: "TRC20 QR कोड",
    platformWalletErc20Label: "प्लेटफ़ॉर्म वॉलेट (ERC20)",
    qrCodeErc20Label: "ERC20 QR कोड",
    editUserTitle: "उपयोगकर्ता संपादित करें",
    userNameLabel: "उपयोगकर्ता का नाम",
    customApyLabel: "कस्टम APY (%)",
    setAccountRole: "खाता भूमिका",
    saveChangesBtn: "परिवर्तन सहेजें",
    fixedRate: "निश्चित",
    sysDefault: "सिस्टम डिफॉल्ट",
    interestEarningLabel: "ब्याज की आय",
    initialDepositLabel: "प्रारंभिक जमा",
    inviteLineMsg: "【KIZUNA PREP LAB】अगली पीढ़ी के USDT लाभ के साथ संपत्ति की रक्षा करें। मेरे इनवाइट कोड का उपयोग करें!\nइनवाइट कोड: {code}\nयहाँ जुड़ें: {url}"
  },
  vn: {
    'adminAuthTitle': "Xác thực quản trị viên",
    'adminAuthDesc': "Vui lòng nhập mã bảo mật 6 chữ số để truy cập Bảng quản trị.",
    'adminAuthPlaceholder': "Nhập mã",
    'adminAuthError': "Mã không chính xác. Vui lòng thử lại.",
    'adminCodeSetting': "Mã truy cập quản trị",
    'adminCodeNote': "* Mã xác thực phụ cho Bảng quản trị (nên dùng 6 chữ số).",
    'verify': "Xác thực"
  },
  th: {
    'adminAuthTitle': "การยืนยันตัวตนผู้ดูแลระบบ",
    'adminAuthDesc': "กรุณาใส่รหัสความปลอดภัย 6 หลักเพื่อเข้าสู่แผงควบคุมผู้ดูแลระบบ",
    'adminAuthPlaceholder': "ใส่รหัส",
    'adminAuthError': "รหัสไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง",
    'adminCodeSetting': "รหัสการเข้าถึงผู้ดูแลระบบ",
    'adminCodeNote': "* รหัสยืนยันตัวตนสำรองสำหรับแผงควบคุม (แนะนำ 6 หลัก)",
    'verify': "ยืนยัน"
  },
  id: {
    'adminAuthTitle': "Verifikasi Admin",
    'adminAuthDesc': "Silakan masukkan 6 digit kode keamanan untuk mengakses Panel Admin.",
    'adminAuthPlaceholder': "Masukkan Kode",
    'adminAuthError': "Kode salah. Silakan coba lagi.",
    'adminCodeSetting': "Kode Akses Admin",
    'adminCodeNote': "* Kode verifikasi sekunder untuk Panel Admin (disarankan 6 digit).",
    'verify': "Verifikasi"
  },
  es: {
    'adminAuthTitle': "Verificación de administrador",
    'adminAuthDesc': "Ingrese el código de seguridad de 6 dígitos para acceder al Panel de administración.",
    'adminAuthPlaceholder': "Ingrese el código",
    'adminAuthError': "Código incorrecto. Inténtelo de nuevo.",
    'adminCodeSetting': "Código de acceso de administrador",
    'adminCodeNote': "* Código de verificación secundaria para el Panel de administración (se recomiendan 6 dígitos).",
    'verify': "Verificar"
  },
  pt: {
    'adminAuthTitle': "Verificação de administrador",
    'adminAuthDesc': "Insira o código de segurança de 6 dígitos para acessar o Painel de administração.",
    'adminAuthPlaceholder': "Insira o código",
    'adminAuthError': "Código incorreto. Tente novamente.",
    'adminCodeSetting': "Código de acesso de administrador",
    'adminCodeNote': "* Código de verificação secundária para o Painel de administrador (recomenda-se 6 dígitos).",
    'verify': "Verificar"
  },
  ar: {
    'adminAuthTitle': "تحقق المسؤول",
    'adminAuthDesc': "يرجى إدخال رمز الأمان المكون من 6 أرقام للوصول إلى لوحة المسؤول.",
    'adminAuthPlaceholder': "أدخل الرمز",
    'adminAuthError': "رمز غير صحيح. يرجى المحاولة مرة أخرى.",
    'adminCodeSetting': "رمز وصول المسؤول",
    'adminCodeNote': "* رمز تحقق ثانوي للوحة المسؤول (يفضل 6 أرقام).",
    'verify': "تحقق"
  }
};

// Fill in other languages with English placeholders for missing keys
LANGUAGES.forEach(lang => {
  if (!TRANSLATIONS[lang.code]) {
    TRANSLATIONS[lang.code] = TRANSLATIONS.en;
  } else {
    // Fill in missing keys from English fallback
    Object.keys(TRANSLATIONS.en).forEach(key => {
      if (!TRANSLATIONS[lang.code][key]) {
        TRANSLATIONS[lang.code][key] = TRANSLATIONS.en[key];
      }
    });
  }
});

const LanguageSelector = ({ currentLang, onSelect, light = false }: { currentLang: string, onSelect: (code: string) => void, light?: boolean }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedLang = LANGUAGES.find(l => l.code === currentLang) || LANGUAGES[0];

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1.5 px-3 py-1 rounded-full border transition-all active:scale-95 ${
          light 
            ? 'bg-white/10 border-white/20 text-white hover:bg-white/20 px-2' 
            : 'bg-editorial-white border-editorial-border text-editorial-navy hover:bg-gray-100'
        }`}
      >
        <img 
          src={`https://flagcdn.com/w40/${selectedLang.flag}.png`} 
          alt={selectedLang.name}
          className="w-4 h-3 md:w-5 md:h-3.5 object-cover rounded-[1px] shadow-sm"
          referrerPolicy="no-referrer"
        />
        <span className={`text-[9px] font-black uppercase tracking-widest ${light ? 'text-white' : 'text-editorial-navy hidden md:inline'}`}>
          {selectedLang.code}
        </span>
        <ChevronRight size={10} className={`transform transition-transform ${isOpen ? 'rotate-90' : ''} ${light ? 'text-white/60' : 'text-gray-400'}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-[100]" onClick={() => setIsOpen(false)} />
            <motion.div 
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 z-[110]"
            >
              <div className="px-3 py-2 border-b border-gray-50 mb-1">
                <span className="text-[8px] font-black text-gray-400 uppercase tracking-[0.2em]">
                  {TRANSLATIONS[currentLang].selectLanguage || "SELECT LANGUAGE"}
                </span>
              </div>
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    onSelect(lang.code);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors ${currentLang === lang.code ? 'bg-editorial-navy/5' : ''}`}
                >
                  <img 
                    src={`https://flagcdn.com/w40/${lang.flag}.png`} 
                    alt={lang.name}
                    className="w-6 h-4 object-cover rounded-[1px] shadow-sm"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex flex-col items-start translate-y-[1px]">
                    <span className={`text-[11px] font-black uppercase tracking-widest ${currentLang === lang.code ? 'text-editorial-gold' : 'text-editorial-navy'}`}>
                      {lang.code}
                    </span>
                    <span className="text-[9px] text-gray-400 font-bold">{lang.name}</span>
                  </div>
                  {currentLang === lang.code && <Check size={12} className="ml-auto text-editorial-gold" />}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

/**
 * Editorial Aesthetic - Component Palette
 */

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <div className="section-label">{children}</div>
);

const StepItem = ({ num, title, description }: { num: number, title: string, description: string }) => (
  <div className="flex items-start gap-4 mb-8 md:mb-8 last:mb-0">
    <div className="editorial-step-num">{num}</div>
    <div>
      <h3 className="text-sm md:text-base font-bold text-editorial-navy mb-1">{title}</h3>
      <p className="text-xs md:text-sm text-editorial-gray leading-relaxed">{description}</p>
    </div>
  </div>
);

const FAQItem = ({ q, a }: { q: string, a: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-editorial-border py-4 last:border-0">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left flex items-start justify-between gap-4 group transition-colors"
      >
        <h4 className="font-bold text-sm text-editorial-navy group-hover:text-editorial-gold leading-tight">
          <span className="text-editorial-gold mr-2 text-xs">Q.</span> {q}
        </h4>
        <ChevronRight 
          className={`shrink-0 transition-transform duration-300 text-editorial-gray/50 ${isOpen ? 'rotate-90' : ''}`} 
          size={16} 
        />
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className="text-xs text-editorial-gray leading-relaxed pt-3 px-6">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const NumberCounter = ({ value, precision = 2, extraPrecision = 4 }: { value: number, precision?: number, extraPrecision?: number }) => {
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    // If it's a small change (ticking), don't use heavy animation, just update
    const diff = Math.abs(value - displayValue);
    if (diff < 0.1 && diff > 0) {
      setDisplayValue(value);
      return;
    }

    const start = displayValue;
    const end = value;
    const duration = 1000;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const current = start + (end - start) * progress;
      setDisplayValue(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [value]);

  const mainPart = displayValue.toLocaleString(undefined, { minimumFractionDigits: precision, maximumFractionDigits: precision });
  const fullValue = displayValue.toFixed(precision + extraPrecision);
  const extraPart = fullValue.split('.')[1].substring(precision);

  return (
    <span className="tabular-nums">
      {mainPart}
      <span className="opacity-30 text-[0.4em] ml-0.5 select-none">{extraPart}</span>
    </span>
  );
};

/**
 * Admin Panel Component
 */
/**
 * Real-time balance component for Admin list
 */
const AdminUserBalance = ({ user, type, defaultApy }: { user: any, type: 'principal' | 'earnings', defaultApy: number }) => {
  const [accrued, setAccrued] = useState(0);

  useEffect(() => {
    // If user has no principal, nothing to accrue
    if ((user.principalBalance || 0) <= 0) {
      setAccrued(0);
      return;
    }

    const apy = user.customApy || defaultApy; 
    const principal = user.principalBalance || 0;
    
    // Convert Firestore timestamp to Date
    const lastSettlement = user.lastSettlementTime?.seconds 
      ? new Date(user.lastSettlementTime.seconds * 1000) 
      : new Date();

    const calculate = () => {
      const now = new Date();
      const elapsed = (now.getTime() - lastSettlement.getTime()) / 1000;
      if (elapsed < 0) return 0;
      // Formula: Daily profit / 24 / 3600 per second
      return principal * (apy / 100 / 365 / 24 / 3600) * elapsed;
    };

    setAccrued(calculate());
    const timer = setInterval(() => {
      setAccrued(calculate());
    }, 1000);
    
    return () => clearInterval(timer);
  }, [user.id, user.principalBalance, user.customApy, user.lastSettlementTime, defaultApy]);

  if (type === 'principal') {
    return <span>${(user.principalBalance || 0).toLocaleString(undefined, { minimumFractionDigits: 3, maximumFractionDigits: 3 })}</span>;
  }
  
  return <span className="text-green-600">${(user.totalEarnings + accrued).toLocaleString(undefined, { minimumFractionDigits: 3, maximumFractionDigits: 3 })}</span>;
};

const AdminPanelView = ({ 
  onBack, 
  currentLang,
  liveApy
}: { 
  onBack: () => void, 
  currentLang: string,
  liveApy: number
}) => {
  const t = (key: string, params?: Record<string, any>) => {
    let text = TRANSLATIONS[currentLang]?.[key] || TRANSLATIONS.en[key] || key;
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        text = text.replace(`{${k}}`, String(v));
      });
    }
    return text;
  };

  const [activeSubView, setActiveSubView] = useState<'dashboard' | 'products' | 'finance' | 'positions' | 'members' | 'info' | 'settings'>('dashboard');
  const [users, setUsers] = useState<any[]>([]);
  const [pendingTransactions, setPendingTransactions] = useState<any[]>([]);
  const [financeTab, setFinanceTab] = useState<'pending' | 'history'>('pending');
  const [allTransactions, setAllTransactions] = useState<any[]>([]);
  const [systemSettings, setSystemSettings] = useState<any>({
    customerServiceUrl: "",
    customerServiceQr: "",
    depositWalletTrc20: "",
    qrCodeTrc20: "",
    depositWalletErc20: "",
    qrCodeErc20: "",
    adminSecretCode: "888888"
  });
  const [isLoading, setIsLoading] = useState(true);
  const [editingUser, setEditingUser] = useState<any>(null);

  // Real-time listener for user list
  useEffect(() => {
    let unsubUsers: (() => void) | null = null;
    
    const loadData = async () => {
      setIsLoading(true);
      try {
        const settingsSnap = await getDoc(doc(db, 'settings', 'system'));
        if (settingsSnap.exists()) {
          setSystemSettings((prev: any) => ({ ...prev, ...settingsSnap.data() }));
        }

        // Real-time listener for user list
        unsubUsers = onSnapshot(collection(db, 'users'), async (snapshot) => {
          const userList = await Promise.all(snapshot.docs.map(async (uDoc) => {
            const userData = uDoc.data();
            const portfolioSnap = await getDoc(doc(db, 'users', uDoc.id, 'portfolio', 'main'));
            const portfolioData = portfolioSnap.exists() ? portfolioSnap.data() : { principalBalance: 0, totalEarnings: 0 };
            
            const userObj = {
              ...userData,
              id: uDoc.id,
              principalBalance: portfolioData.principalBalance || 0,
              totalEarnings: portfolioData.totalEarnings || 0,
              lastSettlementTime: portfolioData.lastUpdated
            };

            // --- AUTO-SETTLEMENT FOR OFFLINE USERS ---
            // If admin sees a user who is overdue (24h+), settle for them
            if (userObj.principalBalance > 0 && userObj.lastSettlementTime) {
              const lastSettle = (userObj.lastSettlementTime as any).toDate ? (userObj.lastSettlementTime as any).toDate() : new Date((userObj.lastSettlementTime as any).seconds * 1000);
              const now = new Date();
              const secondsPassed = (now.getTime() - lastSettle.getTime()) / 1000;

              if (secondsPassed >= 86400) {
                const daysPassed = Math.floor(secondsPassed / 86400);
                const apy = (userObj as any).customApy || liveApy;
                const dailyProfit = userObj.principalBalance * (apy / 100 / 365);
                const totalNewEarnings = dailyProfit * daysPassed;

                 if (totalNewEarnings > 0) {
                   const portfolioRef = doc(db, 'users', uDoc.id, 'portfolio', 'main');
                   const batch = writeBatch(db);
                   
                   batch.set(portfolioRef, {
                     totalEarnings: (userObj.totalEarnings || 0) + totalNewEarnings,
                     lastUpdated: serverTimestamp()
                   }, { merge: true });

                   for (let i = 0; i < daysPassed; i++) {
                     const recRef = doc(collection(db, 'users', uDoc.id, 'portfolio', 'main', 'earnings'));
                     batch.set(recRef, {
                       amount: dailyProfit,
                       type: 'daily_yield',
                       timestamp: serverTimestamp(),
                       description: `Admin Auto-Settlement (${userObj.principalBalance.toLocaleString()} USDT @ ${apy}%)`
                     });
                   }
                   
                   batch.commit().catch(e => console.error("Admin auto-settle error:", e));
                   
                   // Update locally to avoid flicker
                   userObj.totalEarnings += totalNewEarnings;
                 }
              }
            }

            return userObj;
          }));
          setUsers(userList);
          setIsLoading(false);
        }, (err) => {
          console.error("Admin Users Sync Error:", err);
          setIsLoading(false);
        });
      } catch (err) {
        console.error("Admin Initial Load Error:", err);
        setIsLoading(false);
      }
    };

    loadData();
    return () => {
      if (unsubUsers) unsubUsers();
    };
  }, [liveApy]); // Depend on liveApy to ensure calculation is correct

  // Refresh dynamic data like transactions on tab switch
  useEffect(() => {
    let unsubs: (() => void)[] = [];

    const setupSync = async () => {
      try {
        // Fetch users once to get the list of IDs
        const usersSnap = await getDocs(collection(db, 'users'));
        const userList = usersSnap.docs.map(d => ({ id: d.id, ...d.data() }));

        // Real-time listener for pending transactions across all users
        // Since collectionGroup often requires manual index setup, 
        // we'll listen to each user's transactions if the list is small,
        // or attempt a simpler collectionGroup.
        
        // Let's listen to ALL transactions and filter them
        const allQ = query(collectionGroup(db, 'transactions'));
        const unsubAll = onSnapshot(allQ, (snapshot) => {
          const txs = snapshot.docs.map(doc => {
            const userId = doc.ref.parent.parent?.id || "";
            const userData = userList.find(u => u.id === userId) || {};
            return {
              id: doc.id,
              userId: userId,
              userEmail: (userData as any).email || (userData as any).uid || "Unknown",
              userName: (userData as any).name || "User",
              ...doc.data()
            } as any;
          }).sort((a, b) => (b.timestamp?.seconds || 0) - (a.timestamp?.seconds || 0));

          setAllTransactions(txs);
          setPendingTransactions(txs.filter(tx => tx.status === 'pending'));
        }, (err) => {
          console.error("Admin All Transactions Error:", err);
          // Fallback logic if collectionGroup fails
          if (err.message.includes('index')) {
            usersSnap.docs.forEach(uDoc => {
              const uQ = query(collection(db, 'users', uDoc.id, 'transactions'));
              const uUnsub = onSnapshot(uQ, (uSnap) => {
                setAllTransactions(prev => {
                  const filtered = prev.filter(tx => tx.userId !== uDoc.id);
                  const newTxs = uSnap.docs.map(d => ({
                    id: d.id,
                    userId: uDoc.id,
                    userEmail: uDoc.data().email || uDoc.id,
                    userName: uDoc.data().name || "User",
                    ...d.data()
                  })) as any[];
                  const updated = [...filtered, ...newTxs].sort((a, b) => (b.timestamp?.seconds || 0) - (a.timestamp?.seconds || 0));
                  setPendingTransactions(updated.filter(tx => tx.status === 'pending'));
                  return updated;
                });
              });
              unsubs.push(uUnsub);
            });
          }
        });
        unsubs.push(unsubAll);
      } catch (err) {
        console.error("Admin setupSync Error:", err);
      }
    };

    if (activeSubView === 'finance' || activeSubView === 'dashboard') {
      setupSync();
    }

    return () => unsubs.forEach(u => u());
  }, [activeSubView]);

  const handleUpdateTransaction = async (userId: string, txId: string, status: 'completed' | 'failed') => {
    try {
      const txRef = doc(db, 'users', userId, 'transactions', txId);
      await updateDoc(txRef, { status, updatedAt: serverTimestamp() });
      setPendingTransactions(prev => prev.filter(tx => tx.id !== txId));
    } catch (err) {
      console.error("Update Tx Error:", err);
    }
  };

  const handleSaveUser = async () => {
    if (!editingUser) return;
    console.log("Saving user:", editingUser.id, editingUser);
    
    try {
      // 1. Update Profile Info
      const userRef = doc(db, 'users', editingUser.id);
      await setDoc(userRef, {
        name: editingUser.name,
        customApy: editingUser.customApy ? parseFloat(editingUser.customApy.toString()) : null,
        role: editingUser.role
      }, { merge: true });
      
      // 2. Settlement & Portfolio Update
      const portfolioRef = doc(db, 'users', editingUser.id, 'portfolio', 'main');
      const portfolioSnap = await getDoc(portfolioRef);
      
      let principalNum = parseFloat(editingUser.principalBalance?.toString()) || 0;
      let earningsInInput = parseFloat(editingUser.totalEarnings?.toString()) || 0;
      let finalEarnings = earningsInInput;
      
      if (portfolioSnap.exists()) {
        const pData = portfolioSnap.data();
        const currentPrincipal = pData.principalBalance || 0;
        const currentEarnings = pData.totalEarnings || 0;
        const lastUpdated = pData.lastUpdated?.toDate() || new Date();
        const secondsPassed = (new Date().getTime() - lastUpdated.getTime()) / 1000;
        
        // Settle accrued interest if principal changed OR if long time passed without change
        // This ensures the "100 from today" logic works
        if (currentPrincipal > 0 && secondsPassed > 0) {
          const apy = editingUser.customApy ? parseFloat(editingUser.customApy.toString()) : liveApy;
          const accrued = currentPrincipal * (apy / 100 / (365 * 24 * 3600)) * secondsPassed;
          
          // If the user didn't manually tweak the earnings field in the UI (approximate due to float precision)
          const earningsModified = Math.abs(earningsInInput - currentEarnings) > 0.000001;
          
          if (!earningsModified) {
             finalEarnings = currentEarnings + accrued;
             
             // Create a settlement record
             try {
               const recRef = doc(collection(db, 'users', editingUser.id, 'portfolio', 'main', 'earnings'));
               await setDoc(recRef, {
                 amount: accrued,
                 type: 'adjustment_settle',
                 timestamp: serverTimestamp(),
                 description: `Settlement before update (${currentPrincipal.toLocaleString()} -> ${principalNum.toLocaleString()})`
               });
             } catch (recErr) {
               console.warn("Could not create settlement record:", recErr);
               // Continue anyway as the balance update is more important
             }
          }
        }
      }

      await setDoc(portfolioRef, {
        principalBalance: principalNum,
        totalEarnings: finalEarnings,
        lastUpdated: serverTimestamp()
      }, { merge: true });

      setUsers(prev => prev.map(u => u.id === editingUser.id ? { 
        ...u, 
        name: editingUser.name,
        role: editingUser.role,
        customApy: editingUser.customApy,
        principalBalance: principalNum,
        totalEarnings: finalEarnings 
      } : u));
      
      alert(currentLang === 'hi' ? "उपयोगकर्ता विवरण सफलतापूर्वक सहेजे गए" : currentLang === 'jp' ? "ユーザー設定が保存されました" : "User settings saved successfully");
      setEditingUser(null);
    } catch (err) {
      console.error("Save User Error:", err);
      alert("Error saving user: " + (err instanceof Error ? err.message : "Unknown error"));
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // QR codes should be small. 500KB is plenty and avoids Firestore 1MB document limit.
    if (file.size > 500 * 1024) {
      alert(currentLang === 'hi' ? "छवि 500KB से अधिक नहीं होनी चाहिए" : currentLang === 'jp' ? "画像は500KBを超えてはいけません" : "Image size exceeds 500KB. Please use a smaller QR code image.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setSystemSettings((prev: any) => ({
        ...prev,
        [field]: reader.result
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleSaveSettings = async () => {
    try {
      await setDoc(doc(db, 'settings', 'system'), {
        ...systemSettings,
        updatedAt: serverTimestamp()
      });
      alert(currentLang === 'hi' ? "सिस्टम सेटिंग्स सफलतापूर्वक सहेजी गईं" : currentLang === 'jp' ? "システム設定が保存されました" : currentLang === 'cn' ? "系统设置保存成功" : "System settings saved successfully");
    } catch (err) {
      console.error("Save Settings Error:", err);
      alert("Error saving settings: " + (err instanceof Error ? err.message : "Unknown error"));
    }
  };

  const totalPrincipal = useMemo(() => users.reduce((acc, u) => acc + (u.principalBalance || 0), 0), [users]);
  const totalEarnings = useMemo(() => users.reduce((acc, u) => acc + (u.totalEarnings || 0), 0), [users]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="w-8 h-8 border-2 border-editorial-navy border-t-editorial-gold rounded-full" />
      </div>
    );
  }

  const NAV_ITEMS = [
    { id: 'dashboard', label: t('adminSummary'), icon: LayoutDashboard, badge: 0 },
    { id: 'products', label: t('productsLabel', { fallback: 'Products' }), icon: TrendingUp, badge: 0 },
    { id: 'finance', label: t('audit'), icon: Wallet, badge: pendingTransactions.length },
    { id: 'positions', label: t('positionsLabel', { fallback: 'Positions' }), icon: ClipboardList, badge: 1 },
    { id: 'members', label: t('memberManagement'), icon: Users, badge: 0 },
    { id: 'info', label: t('infoLabel', { fallback: 'News' }), icon: Newspaper, badge: 0 },
    { id: 'settings', label: t('systemSettings'), icon: Settings, badge: 0 },
  ];

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      {/* Redesigned Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-100 flex flex-col pt-8">
        <div className="px-6 mb-10 flex items-center gap-2 cursor-pointer" onClick={onBack}>
          <div className="w-8 h-8 bg-black rounded flex items-center justify-center text-white font-black italic">K</div>
          <span className="font-black italic tracking-tighter text-lg">{t('adminPanelTitle')}</span>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {NAV_ITEMS.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveSubView(item.id)}
              className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl transition-all relative group ${
                activeSubView === item.id 
                ? 'bg-[#e62129] text-white shadow-[0_12px_24px_rgba(230,33,41,0.25)]' 
                : 'text-[#5d6a85] hover:bg-gray-50'
              }`}
            >
              <item.icon size={22} className={activeSubView === item.id ? 'text-white' : 'text-[#8a94a6] group-hover:text-[#5d6a85]'} />
              <span className="font-bold text-[15px] tracking-wide">{item.label}</span>
              
              {item.badge ? (
                <span className={`ml-auto flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-black ${
                  activeSubView === item.id ? 'bg-white text-[#e62129]' : 'bg-[#e62129] text-white'
                }`}>
                  {item.badge}
                </span>
              ) : null}

              {activeSubView === item.id && (
                <motion.div 
                  layoutId="indicator"
                  className="absolute right-4 w-1.5 h-1.5 bg-white/60 rounded-full shadow-[0_0_8px_rgba(255,255,255,0.8)]"
                />
              )}
            </button>
          ))}
        </nav>

        <div className="p-4 mt-auto">
          <button 
            onClick={onBack}
            className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all rounded-lg"
          >
            <LogOut size={18} />
            <span className="font-bold text-sm">{t('exitAdminBtn')}</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-10">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-2xl font-black text-gray-900 mb-1">
              {NAV_ITEMS.find(n => n.id === activeSubView)?.label}
            </h1>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest leading-none">{t('contentMgmtSystem')} / {NAV_ITEMS.find(n => n.id === activeSubView)?.label}</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{t('superAdmin')}</div>
              <div className="text-xs font-black text-editorial-navy">oopqwe001@gmail.com</div>
            </div>
            <div className="w-10 h-10 rounded-full bg-editorial-navy text-white flex items-center justify-center font-black shadow-lg shadow-editorial-navy/20">A</div>
          </div>
        </header>

        {/* Dashboard / Summary View */}
        {activeSubView === 'dashboard' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { label: t('totalUsersAdmin'), value: users.length, icon: Users, color: 'text-blue-600' },
                { label: t('totalDepositsAdmin'), value: totalPrincipal.toLocaleString(), icon: Wallet, color: 'text-green-600' },
                { label: t('totalEarningsDistAdmin'), value: totalEarnings.toLocaleString(), icon: TrendingUp, color: 'text-orange-600' },
                { label: t('pendingAuditsAdmin'), value: pendingTransactions.length, icon: Clock, color: 'text-red-600' },
              ].map((stat, i) => (
                <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-4">
                  <div className={`w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center ${stat.color}`}>
                    <stat.icon size={20} />
                  </div>
                  <div>
                    <div className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-1">{stat.label}</div>
                    <div className="text-2xl font-black italic tracking-tight">{stat.value}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
                <h3 className="text-sm font-black uppercase tracking-widest mb-6">{t('recentActiveUsers')}</h3>
                <div className="space-y-4">
                  {users.slice(0, 5).map(u => (
                    <div key={u.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-editorial-navy/5 flex items-center justify-center text-editorial-navy font-bold text-xs">{u.name?.charAt(0)}</div>
                        <div>
                          <div className="text-xs font-black">{u.name}</div>
                          <div className="text-[10px] text-gray-400 font-bold">{u.email}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-black italic tracking-tight">${u.principalBalance?.toLocaleString()}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-[#e62129] p-8 rounded-2xl shadow-xl shadow-red-200 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10"><Shield size={120} /></div>
                <div className="relative z-10">
                  <h3 className="text-sm font-black uppercase tracking-widest mb-8 opacity-60">系统运行状态</h3>
                  <div className="text-4xl font-black italic tracking-tighter mb-4">运行正常</div>
                  <p className="text-xs text-white/60 font-bold uppercase tracking-widest max-w-[200px] leading-relaxed">所有区块链同步服务目前均处于正常运行状态。</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Finance View (Audit) */}
        {activeSubView === 'finance' && (
          <div className="space-y-6">
            <div className="flex gap-4 mb-4">
              <button 
                onClick={() => setFinanceTab('pending')}
                className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                  financeTab === 'pending' ? 'bg-editorial-navy text-white shadow-lg shadow-gray-200' : 'bg-white text-gray-400 border border-gray-100 hover:bg-gray-50'
                }`}
              >
                {t('pendingReview')} ({pendingTransactions.length})
              </button>
              <button 
                onClick={() => setFinanceTab('history')}
                className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                  financeTab === 'history' ? 'bg-editorial-navy text-white shadow-lg shadow-gray-200' : 'bg-white text-gray-400 border border-gray-100 hover:bg-gray-50'
                }`}
              >
                {t('withdrawHistory')} / {t('historyTitle')}
              </button>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden text-[#5d6a85]">
              <div className="divide-y divide-gray-50">
                {(financeTab === 'pending' ? pendingTransactions : allTransactions).length === 0 ? (
                  <div className="text-center py-20 text-gray-400 text-xs font-bold uppercase tracking-widest">
                    {t('noPendingRequests')}
                  </div>
                ) : (
                  (financeTab === 'pending' ? pendingTransactions : allTransactions).map(tx => (
                    <div key={tx.id} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-6">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${tx.type === 'deposit' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                          {tx.type === 'deposit' ? <ArrowUpRight size={24} /> : <ArrowDownLeft size={24} />}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${tx.type === 'deposit' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
                              {tx.type === 'deposit' ? t('depositAction') : t('withdrawAction')}
                            </span>
                            <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                              tx.status === 'completed' ? 'bg-green-100 text-green-700' : 
                              tx.status === 'failed' ? 'bg-red-100 text-red-700' : 
                              'bg-yellow-100 text-yellow-700'
                            }`}>
                              {t(`status${tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}`)}
                            </span>
                            <span className="text-[10px] font-black text-gray-400">{tx.network}</span>
                          </div>
                          <div className="text-xl font-black italic tracking-tight text-gray-900">${tx.amount.toLocaleString()}</div>
                          
                          <div className="mt-2 flex flex-col gap-1 text-[#5d6a85]">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-black uppercase text-gray-400">User:</span>
                              <span className="text-xs font-bold text-editorial-navy">{tx.userName}</span>
                              <span className="text-[10px] text-gray-400 font-medium">({tx.userEmail})</span>
                            </div>
                            
                            {tx.address && (
                              <div className="flex items-center gap-2 bg-gray-100 p-2 rounded-lg mt-1 group">
                                <span className="text-[10px] font-black uppercase text-gray-400">Wallet:</span>
                                <code className="text-[11px] font-mono font-bold text-editorial-navy truncate max-w-[240px]">
                                  {tx.address}
                                </code>
                                <button 
                                  onClick={() => {
                                    navigator.clipboard.writeText(tx.address || "");
                                    alert("Address copied!");
                                  }}
                                  className="p-1 hover:bg-white rounded transition-colors text-gray-400 hover:text-editorial-navy"
                                  title="Copy Address"
                                >
                                  <Copy size={12} />
                                </button>
                              </div>
                            )}
                            
                            <div className="text-[9px] font-bold text-gray-300 uppercase tracking-widest mt-1">
                              {tx.timestamp?.toDate ? tx.timestamp.toDate().toLocaleString() : 'N/A'}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {tx.status === 'pending' && (
                        <div className="flex gap-2">
                          <button 
                            onClick={() => handleUpdateTransaction(tx.userId, tx.id, 'completed')}
                            className="px-6 py-3 bg-green-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-green-700 active:scale-95 transition-all shadow-lg shadow-green-200"
                          >
                            {t('approveBtn')}
                          </button>
                          <button 
                            onClick={() => handleUpdateTransaction(tx.userId, tx.id, 'failed')}
                            className="px-6 py-3 bg-red-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-red-700 active:scale-95 transition-all shadow-lg shadow-red-200"
                          >
                            {t('rejectBtn')}
                          </button>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}


        {/* Member Management View */}
        {(activeSubView === 'members' || activeSubView === 'positions') && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
              <h3 className="text-sm font-black uppercase tracking-widest">{t('userListTitle')} ({users.length})</h3>
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                  <input type="text" placeholder={t('searchUserPlaceholder')} className="bg-white border rounded-xl pl-9 pr-4 py-2 text-xs focus:ring-1 focus:ring-editorial-navy outline-none" />
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50/50 text-[10px] font-black uppercase tracking-widest text-gray-400">
                  <tr>
                    <th className="px-6 py-4">{t('userInfoHeader')}</th>
                    <th className="px-6 py-4">{t('principalHeader')}</th>
                    <th className="px-6 py-4">{t('earningsHeader')}</th>
                    <th className="px-6 py-4">{t('apyHeader')}</th>
                    <th className="px-6 py-4">{t('roleHeader')}</th>
                    <th className="px-6 py-4 text-right">{t('actionHeader')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {users.map(user => (
                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center font-bold text-xs text-editorial-navy">{user.name?.charAt(0)}</div>
                          <div>
                            <div className="text-xs font-black">{user.name}</div>
                            <div className="text-[10px] text-gray-400 font-bold">{user.email || user.uid}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs font-black italic tracking-tight text-editorial-navy">
                        <AdminUserBalance user={user} type="principal" defaultApy={liveApy} />
                      </td>
                      <td className="px-6 py-4 text-xs font-black italic tracking-tight">
                        <AdminUserBalance user={user} type="earnings" defaultApy={liveApy} />
                      </td>
                      <td className="px-6 py-4 font-black">
                         <span className={`text-[10px] px-2 py-0.5 rounded-full ${user.customApy ? 'bg-orange-50 text-orange-600 border border-orange-100' : 'bg-gray-50 text-gray-400'}`}>
                           {user.customApy ? `${user.customApy}% (${t('fixedRate')})` : t('sysDefault')}
                         </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${user.role === 'admin' ? 'bg-editorial-navy text-white' : 'bg-gray-100 text-gray-400'}`}>
                          {user.role || 'user'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => setEditingUser({ ...user })}
                          className="p-2 text-gray-400 hover:text-[#e60012] transition-colors"
                        >
                          <Edit size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* System Settings View */}
        {activeSubView === 'settings' && (
          <div className="max-w-2xl">
            <div className="bg-white p-10 rounded-2xl border border-gray-100 shadow-sm space-y-8">
              <h2 className="text-sm font-black uppercase tracking-widest text-gray-900 border-b pb-6">{t('sysConfigTitle')}</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-3">{t('customerServiceUrlLabel')}</label>
                  <input 
                    type="text"
                    value={systemSettings.customerServiceUrl}
                    onChange={e => setSystemSettings({...systemSettings, customerServiceUrl: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-100 p-4 rounded-xl text-[11px] font-bold focus:outline-none focus:border-editorial-navy transition-colors"
                    placeholder="https://t.me/your_support"
                  />
                  <div className="mt-4">
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-2">{t('customerServiceQrLabel')}</label>
                    <div className="flex items-center gap-4">
                      {systemSettings.customerServiceQr && (
                        <img src={systemSettings.customerServiceQr} alt="Support QR" className="w-16 h-16 rounded-xl object-cover border" />
                      )}
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, 'customerServiceQr')}
                        className="text-[10px] text-gray-400"
                      />
                    </div>
                  </div>
                </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-3">{t('platformWalletTrc20Label')}</label>
                      <input 
                        type="text"
                        value={systemSettings.depositWalletTrc20}
                        onChange={e => setSystemSettings({...systemSettings, depositWalletTrc20: e.target.value})}
                        className="w-full bg-gray-50 border border-gray-100 p-4 rounded-xl text-[11px] font-mono focus:outline-none focus:border-editorial-navy"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-2">{t('qrCodeTrc20Label')}</label>
                      <div className="flex items-center gap-4">
                        {systemSettings.qrCodeTrc20 && (
                          <img src={systemSettings.qrCodeTrc20} alt="TRC20 QR" className="w-16 h-16 rounded-xl object-cover border" />
                        )}
                        <input 
                          type="file" 
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, 'qrCodeTrc20')}
                          className="text-[10px] text-gray-400"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-3">{t('platformWalletErc20Label')}</label>
                      <input 
                        type="text"
                        value={systemSettings.depositWalletErc20}
                        onChange={e => setSystemSettings({...systemSettings, depositWalletErc20: e.target.value})}
                        className="w-full bg-gray-50 border border-gray-100 p-4 rounded-xl text-[11px] font-mono focus:outline-none focus:border-editorial-navy"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-2">{t('qrCodeErc20Label')}</label>
                      <div className="flex items-center gap-4">
                        {systemSettings.qrCodeErc20 && (
                          <img src={systemSettings.qrCodeErc20} alt="ERC20 QR" className="w-16 h-16 rounded-xl object-cover border" />
                        )}
                        <input 
                          type="file" 
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, 'qrCodeErc20')}
                          className="text-[10px] text-gray-400"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-3">
                    {TRANSLATIONS[currentLang]?.adminCodeSetting || "Admin Access Code"}
                  </label>
                  <input 
                    type="text"
                    value={systemSettings.adminSecretCode}
                    onChange={e => setSystemSettings({...systemSettings, adminSecretCode: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-100 p-4 rounded-xl text-[11px] font-mono focus:outline-none focus:border-editorial-navy transition-colors"
                    placeholder="888888"
                  />
                  <p className="text-[9px] text-gray-400 font-bold mt-2 italic">
                    {TRANSLATIONS[currentLang]?.adminCodeNote || "* Use this code to verify admin entry."}
                  </p>
                </div>
              </div>

              <div className="pt-6">
                <button 
                  onClick={handleSaveSettings}
                  className="w-full bg-editorial-navy text-white font-black py-4 rounded-xl text-[10px] uppercase tracking-[0.3em] shadow-[0_10px_20px_rgba(30,41,59,0.15)] active:scale-95 transition-all"
                >
                  {t('saveSettings')}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Placeholders for unfinished views */}
        {(activeSubView === 'products' || activeSubView === 'info') && (
          <div className="flex flex-col items-center justify-center py-40 bg-white rounded-3xl border-2 border-dashed border-gray-100 p-10 text-center">
            <div className="w-20 h-20 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-200 mb-6 shadow-inner">
              {React.createElement(NAV_ITEMS.find(n => n.id === activeSubView)?.icon || LayoutDashboard, { size: 40 })}
            </div>
            <h3 className="text-lg font-black text-gray-900 mb-2">{NAV_ITEMS.find(n => n.id === activeSubView)?.label} 模块</h3>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-[0.3em] max-w-sm leading-relaxed">该模块正在优化更新中，敬请期待更多资产管理功能的发布。</p>
          </div>
        )}
      </main>

      {/* User Edit Modal */}
      <AnimatePresence>
        {editingUser && (
          <div className="fixed inset-0 z-[500] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setEditingUser(null)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }} className="relative bg-white w-full max-w-md rounded-3xl p-10 shadow-2xl overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-[#e60012]"></div>
              <h3 className="text-xl font-black uppercase italic tracking-tighter mb-8 flex items-center gap-3">
                <div className="w-6 h-6 rounded bg-[#e60012] flex items-center justify-center text-white"><Edit size={12} /></div>
                编辑会员信息
              </h3>
              
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">用户名</label>
                    <input type="text" value={editingUser.name} onChange={e => setEditingUser({...editingUser, name: e.target.value})} className="w-full bg-gray-50 border border-gray-100 p-4 rounded-xl text-xs font-bold focus:outline-none focus:border-[#e60012]" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">角色</label>
                    <select value={editingUser.role} onChange={e => setEditingUser({...editingUser, role: e.target.value})} className="w-full bg-gray-50 border border-gray-100 p-4 rounded-xl text-xs font-bold appearance-none">
                      <option value="user">标准用户 (User)</option>
                      <option value="admin">管理员 (Admin)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">主要本金 (USDT)</label>
                    <input type="number" step="any" value={editingUser.principalBalance} onChange={e => setEditingUser({...editingUser, principalBalance: e.target.value})} className="w-full bg-gray-50 border border-gray-100 p-4 rounded-xl text-xs font-bold" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">累计收益 (USDT)</label>
                    <input type="number" step="any" value={editingUser.totalEarnings} onChange={e => setEditingUser({...editingUser, totalEarnings: e.target.value})} className="w-full bg-gray-50 border border-gray-100 p-4 rounded-xl text-xs font-bold" />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">个性化利率 (单户 APY %)</label>
                  <input type="number" step="0.01" value={editingUser.customApy || ""} onChange={e => setEditingUser({...editingUser, customApy: e.target.value})} className="w-full bg-gray-50 border border-gray-100 p-4 rounded-xl text-xs font-bold" placeholder="留空则使用系统全局利率" />
                </div>
              </div>

              <div className="flex gap-3 mt-10">
                <button onClick={handleSaveUser} className="flex-1 bg-[#e60012] text-white font-black py-4 rounded-xl text-[10px] uppercase tracking-widest shadow-lg shadow-red-200 active:scale-95 transition-all">保存设置</button>
                <button onClick={() => setEditingUser(null)} className="flex-1 border-2 border-gray-100 text-gray-400 font-black py-4 rounded-xl text-[10px] uppercase tracking-widest hover:bg-gray-50 transition-colors">取消</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const DashboardView = ({ 
  onBack, 
  onLogout,
  onAdminPanel,
  userProfile,
  liveApy, 
  onAccountUpdate,
  currentLang,
  onLangChange
}: { 
  onBack: () => void, 
  onLogout: () => void,
  onAdminPanel: () => void,
  userProfile: { method: 'line' | 'email' | 'google' | null, name: string | null, uid: string, referralCode?: string, referralCount?: number, role?: string } | null,
  liveApy: number, 
  onAccountUpdate: (principal: number, earnings: number) => void,
  currentLang: string,
  onLangChange: (code: string) => void
}) => {
  const t = (key: string, params?: Record<string, any>) => {
    let text = TRANSLATIONS[currentLang]?.[key] || TRANSLATIONS.en[key] || key;
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        text = text.replace(`{${k}}`, String(v));
      });
    }
    return text;
  };
  const [activeTab, setActiveTab] = useState<'home' | 'history' | 'invite' | 'settings'>('home');
  const [activeSettingsView, setActiveSettingsView] = useState<'main' | 'security' | 'wallet'>('main');
  
    // Real-time Balance States fetched from Firestore
    const [principalBalance, setPrincipalBalance] = useState(0);
    const [totalEarnings, setTotalEarnings] = useState(0);
    const [yesterdayEarnings, setYesterdayEarnings] = useState(0);
    const [lastSettlementTime, setLastSettlementTime] = useState<Date | null>(null);
    const [earningsRecords, setEarningsRecords] = useState<any[]>([]);
    
    // Ticking earnings state (separate from totalEarnings to handle compounding smoothly)
    const [accruedSinceSettlement, setAccruedSinceSettlement] = useState(0);

    const [showWithdrawModal, setShowWithdrawModal] = useState(false);
    const [showDepositModal, setShowDepositModal] = useState(false);
  const [depositNetwork, setDepositNetwork] = useState<'TRC20' | 'ERC20'>('TRC20');
  const [copied, setCopied] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showSecurityModal, setShowSecurityModal] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState<string>("");
  const [withdrawAddress, setWithdrawAddress] = useState<string>("");
  const [withdrawNetwork, setWithdrawNetwork] = useState<'TRC20' | 'ERC20'>('TRC20');
  const [historyTab, setHistoryTab] = useState<'earnings' | 'capital' | 'transactions'>('earnings');
  const [transactions, setTransactions] = useState<any[]>([]);
  const [walletAddress, setWalletAddress] = useState("");
  const [isDepositing, setIsDepositing] = useState(false);
  const [showSupportQrModal, setShowSupportQrModal] = useState(false);
  const [pendingDepositAmount, setPendingDepositAmount] = useState<number | null>(null);
  const [depositInputAmount, setDepositInputAmount] = useState<string>("");
  const [referrals, setReferrals] = useState<any[]>([]);
  const [referralCount, setReferralCount] = useState(0);
  const [totalReferralBonusAmount, setTotalReferralBonusAmount] = useState(0);

  const [sysSettings, setSysSettings] = useState({
    customerServiceUrl: "",
    customerServiceQr: "",
    depositWalletTrc20: "TXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
    qrCodeTrc20: "",
    depositWalletErc20: "0xXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
    qrCodeErc20: "",
    adminSecretCode: "888888"
  });

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'settings', 'system'), (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        setSysSettings(prev => ({ ...prev, ...data }));
      }
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!userProfile?.uid) return;
    const referralsRef = collection(db, 'users', userProfile.uid, 'referrals');
    const unsub = onSnapshot(query(referralsRef, orderBy('timestamp', 'desc')), (snapshot) => {
      const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() as any }));
      setReferrals(list);
      setReferralCount(list.length);
      const bonus = list.reduce((acc, curr) => acc + (curr.rewardAmount || 0), 0);
      setTotalReferralBonusAmount(bonus);
    });
    return () => unsub();
  }, [userProfile?.uid]);

  const maskName = (name: string) => {
    if (!name) return "***";
    return name.slice(0, 1) + "＊";
  };

  const handleLineInvite = () => {
    const message = t('inviteLineMsg', { code: userProfile?.referralCode, url: window.location.origin });
    window.open(`https://line.me/R/msg/text/?${encodeURIComponent(message)}`, '_blank');
  };

  const inviteGoal = 3;
  const currentProgress = referralCount % inviteGoal;
  const remainingForBonus = inviteGoal - currentProgress;

  // Firestore Sync Effect
  useEffect(() => {
    if (!userProfile?.uid) return;

    // Listen to Portfolio
    const portfolioRef = doc(db, 'users', userProfile.uid, 'portfolio', 'main');
    const unsubPortfolio = onSnapshot(portfolioRef, async (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        const principal = data.principalBalance || 0;
        const earnings = data.totalEarnings || 0;
        const lastUpdated = data.lastUpdated?.toDate() || new Date();

        setPrincipalBalance(principal);
        setTotalEarnings(earnings);
        setLastSettlementTime(lastUpdated);

        // Perform settlement if 24 hours passed
        const now = new Date();
        const secondsPassed = (now.getTime() - lastUpdated.getTime()) / 1000;
        
        // Settlement interval: 24 hours (86400 seconds)
        if (principal > 0 && secondsPassed >= 86400) {
          const daysPassed = Math.floor(secondsPassed / 86400);
          const dailyProfit = principal * (liveApy / 100 / 365);
          const totalNewEarnings = dailyProfit * daysPassed;
          
          if (totalNewEarnings > 0) {
            try {
              const batch = writeBatch(db);
              
              // 1. Update Portfolio
              batch.set(portfolioRef, {
                totalEarnings: earnings + totalNewEarnings,
                lastUpdated: serverTimestamp()
              }, { merge: true });

              // 2. Add History Records (one for each day passed)
              for (let i = 0; i < daysPassed; i++) {
                const recordRef = doc(collection(db, 'users', userProfile!.uid, 'portfolio', 'main', 'earnings'));
                batch.set(recordRef, {
                  amount: dailyProfit,
                  type: 'daily_yield',
                  timestamp: serverTimestamp(), // In real app, this should be the end of that specific day
                  description: `Daily Interest Settlement (${principal.toLocaleString()} USDT @ ${liveApy}%)`
                });
              }

              await batch.commit();
            } catch (err) {
              console.error("Auto Settlement Error:", err);
            }
          }
        }

        // Sync parent for unified calculations
        onAccountUpdate(principal, earnings);
      } else {
        // Initialize portfolio if not exists
        setDoc(portfolioRef, {
          principalBalance: 0,
          totalEarnings: 0,
          lastUpdated: serverTimestamp()
        }).catch(err => handleFirestoreError(err, OperationType.WRITE, portfolioRef.path));
      }
    }, (err) => handleFirestoreError(err, OperationType.GET, portfolioRef.path));

    // Listen to Transactions
    const txRef = collection(db, 'users', userProfile!.uid, 'transactions');
    const qTx = query(txRef, orderBy('timestamp', 'desc'), limit(50));
    const unsubTx = onSnapshot(qTx, (snapshot) => {
      setTransactions(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (err) => handleFirestoreError(err, OperationType.GET, txRef.path));

    // Listen to Earnings History
    const earningsHistoryRef = collection(db, 'users', userProfile!.uid, 'portfolio', 'main', 'earnings');
    const qEarnings = query(earningsHistoryRef, orderBy('timestamp', 'desc'), limit(30));
    const unsubEarnings = onSnapshot(qEarnings, (snapshot) => {
      const records = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setEarningsRecords(records);
      
      if (records.length > 0) {
        // Sum up records from the last 24 hours to show a consistent "recent yield"
        const now = new Date().getTime();
        const past24h = now - (24 * 60 * 60 * 1000);
        
        const recentTotal = records.reduce((acc, rec: any) => {
          const ts = rec.timestamp?.toDate ? rec.timestamp.toDate().getTime() : 0;
          if (ts > past24h) {
            return acc + (rec.amount || 0);
          }
          return acc;
        }, 0);

        // Fallback to the absolute latest if no records in 24h (edge case) or show the sum
        setYesterdayEarnings(recentTotal > 0 ? recentTotal : ((records[0] as any).amount || 0));
      }
    }, (err) => handleFirestoreError(err, OperationType.GET, earningsHistoryRef.path));

    return () => {
      unsubPortfolio();
      unsubTx();
      unsubEarnings();
    };
  }, [userProfile?.uid, onAccountUpdate]);

  const isNewUser = principalBalance <= 0;

  // Dynamic history generation based on current time and balance
  const earningsHistory = useMemo(() => {
    return earningsRecords.map(rec => ({
      date: rec.timestamp?.toDate ? rec.timestamp.toDate().toLocaleDateString() : new Date().toLocaleDateString(),
      time: rec.timestamp?.toDate ? rec.timestamp.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "00:00",
      type: t('dailyEarning'),
      amount: `+$${(rec.amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USDT`
    }));
  }, [earningsRecords, t]);

  const capitalHistory = useMemo(() => {
    if (isNewUser) return [];
    return [
      { date: "2026/04/17", amount: `+$${principalBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}`, type: t('initialDeposit'), color: "text-editorial-navy" }
    ];
  }, [principalBalance, isNewUser, t]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const depositAddresses = {
    TRC20: sysSettings.depositWalletTrc20 || "TXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
    ERC20: sysSettings.depositWalletErc20 || "0xXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
  };

  // Initialize mock earnings based on principal if it's an "old user" (coming from landing or test deposit)
  // 移除模拟历史数据的 Effect，确保所有数据来自数据库或真实的实时计算
  useEffect(() => {
    if (principalBalance === 0) {
      setYesterdayEarnings(0);
      setTotalEarnings(0);
    }
  }, [principalBalance]);

  // Real-time ticking logic
  useEffect(() => {
    if (isNewUser || !lastSettlementTime) return;
    
    // Initial accrued calculation from last settlement to now (to catch up pending)
    const calculatePending = () => {
      const now = new Date();
      const secondsSinceSettle = (now.getTime() - lastSettlementTime.getTime()) / 1000;
      const apyFactor = liveApy / 100;
      // Discrete per-second compounding approximation
      return principalBalance * (apyFactor / (365 * 24 * 3600)) * Math.max(0, secondsSinceSettle);
    };

    setAccruedSinceSettlement(calculatePending());

    const apyFactor = liveApy / 100;
    const incrementPerSecond = (principalBalance * apyFactor) / (365 * 24 * 3600);
    
    const timer = setInterval(() => {
      setAccruedSinceSettlement(prev => prev + incrementPerSecond);
    }, 1000);
    
    return () => clearInterval(timer);
  }, [isNewUser, principalBalance, liveApy, lastSettlementTime]);

  const displayTotalEarnings = totalEarnings + accruedSinceSettlement;
  const displayTotalBalance = principalBalance + displayTotalEarnings;

  const handleWithdraw = async () => {
    const amount = parseFloat(withdrawAmount);
    if (isNaN(amount) || amount <= 0 || amount > displayTotalBalance || !userProfile?.uid) return;

    setIsWithdrawing(true);
    try {
      // 1. Settle accrued interest first
      const portfolioRef = doc(db, 'users', userProfile.uid, 'portfolio', 'main');
      const snap = await getDoc(portfolioRef);
      let currentEarnings = totalEarnings;
      
      if (snap.exists()) {
        const data = snap.data();
        const lastUpdated = data.lastUpdated?.toDate() || new Date();
        const secondsPassed = (new Date().getTime() - lastUpdated.getTime()) / 1000;
        
        if (principalBalance > 0 && secondsPassed > 0) {
          const apyFactor = liveApy / 100;
          const accrued = principalBalance * (apyFactor / (365 * 24 * 3600)) * secondsPassed;
          currentEarnings += accrued;
        }
      }

      const txRef = doc(collection(db, 'users', userProfile.uid, 'transactions'));
      await setDoc(txRef, {
        type: 'withdrawal',
        amount: amount,
        status: 'pending',
        network: withdrawNetwork,
        address: withdrawAddress,
        timestamp: serverTimestamp()
      });

      // 2. Update Portfolio
      await setDoc(portfolioRef, {
        principalBalance: Math.max(0, principalBalance - amount),
        totalEarnings: currentEarnings,
        lastUpdated: serverTimestamp()
      }, { merge: true });

      alert(currentLang === 'jp' ? "出金申請が送信されました。審査をお待ちください。" : currentLang === 'cn' ? "提现申请已提交，请等待审核。" : "Withdrawal request submitted. Please wait for review.");
      
      setWithdrawAmount("");
      setWithdrawAddress("");
      setShowWithdrawModal(false);
    } catch (error) {
      console.error("Withdraw Error:", error);
      alert("Error: " + (error instanceof Error ? error.message : "Unknown error"));
      handleFirestoreError(error, OperationType.WRITE, 'withdrawal_flow');
    } finally {
      setIsWithdrawing(false);
    }
  };

  const startDeposit = (amount: number | null = null) => {
    setPendingDepositAmount(amount);
    setDepositInputAmount(amount ? amount.toString() : "5000");
    setShowDepositModal(true);
  };

  const handleDepositConfirm = async () => {
    const finalAmount = parseFloat(depositInputAmount);
    if (isNaN(finalAmount) || finalAmount <= 0 || !userProfile?.uid) return;

    setIsDepositing(true);
    
    try {
      // 1. Log Transaction
      const txRef = doc(collection(db, 'users', userProfile.uid, 'transactions'));
      await setDoc(txRef, {
        type: 'deposit',
        amount: finalAmount,
        status: 'completed',
        network: depositNetwork,
        timestamp: serverTimestamp()
      });

      // 2. Settle accrued interest first so new funds don't get historical rates
      const portfolioRef = doc(db, 'users', userProfile.uid, 'portfolio', 'main');
      const snap = await getDoc(portfolioRef);
      let currentEarnings = totalEarnings;
      
      if (snap.exists()) {
        const data = snap.data();
        const lastUpdated = data.lastUpdated?.toDate() || new Date();
        const secondsPassed = (new Date().getTime() - lastUpdated.getTime()) / 1000;
        
        if (principalBalance > 0 && secondsPassed > 0) {
          const apyFactor = liveApy / 100;
          const accrued = principalBalance * (apyFactor / (365 * 24 * 3600)) * secondsPassed;
          currentEarnings += accrued;
        }
      }

      // 3. Update Balance and Earnings together
      await setDoc(portfolioRef, {
        principalBalance: principalBalance + finalAmount,
        totalEarnings: currentEarnings,
        lastUpdated: serverTimestamp()
      }, { merge: true });

      // Simulate blockchain delay for UI feel
      setTimeout(() => {
        setIsDepositing(false);
        setShowDepositModal(false);
        setPendingDepositAmount(null);
        setDepositInputAmount("");
      }, 2000);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'deposit_flow');
    }
  };

  const renderHome = () => (
    <div className="p-6 space-y-6 -mt-4 relative z-10">
      {/* Permanent Guidance Banner - 1000 JPY Gateway */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-editorial-gold p-4 rounded-lg shadow-xl border-l-4 border-editorial-navy relative overflow-hidden group"
      >
        <div className="absolute top-0 right-0 p-4 opacity-10 rotate-12 group-hover:rotate-0 transition-transform">
          <Coins size={64} />
        </div>
        <h3 className="text-editorial-navy font-black text-xs uppercase tracking-widest mb-1 flex items-center gap-2">
          <ShieldCheck size={14} />
          {isNewUser ? t('readMsg') : t('dashboard')}
        </h3>
        <p className="text-white font-bold text-lg italic leading-tight mb-3">
          {isNewUser 
            ? t('depositTipNew')
            : t('depositTipOld')}
        </p>
        <div className="flex gap-2">
           {isNewUser ? (
             <div className="flex gap-2">
               <button 
                 onClick={() => startDeposit(10000.00)}
                 className="bg-editorial-navy text-white text-[10px] font-black py-2 px-4 rounded-sm uppercase tracking-widest shadow-lg active:scale-95 transition-transform"
               >
                 {t('demoDeposit')}
               </button>
               <button 
                 onClick={() => startDeposit(1240.25)}
                 className="bg-editorial-navy/80 text-white text-[10px] font-black py-2 px-4 rounded-sm uppercase tracking-widest shadow-md active:scale-95 transition-transform"
               >
                 {t('smallTest')}
               </button>
             </div>
           ) : (
             <button 
               onClick={() => startDeposit(5000)}
               className="flex items-center gap-1.5 bg-editorial-navy/20 text-editorial-navy text-[9px] font-black py-1 px-3 border border-editorial-navy/30 rounded-sm uppercase tracking-widest hover:bg-editorial-navy/30 transition-colors"
             >
                <span>{t('addDepositTest')}</span>
                <div className="w-1 h-1 bg-editorial-navy rounded-full animate-pulse" />
             </button>
           )}
        </div>
      </motion.div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <button 
          onClick={() => setShowDepositModal(true)}
          className="bg-editorial-gold text-white font-bold py-4 px-4 rounded-sm text-xs shadow-xl shadow-editorial-gold/20 flex flex-col items-center justify-center gap-1 active:scale-95 transition-transform"
        >
          <div className="flex items-center gap-2">
            <Plus size={16} />
            <span>{t('addDeposit')}</span>
          </div>
        </button>
        <div className="flex flex-col gap-2">
          <button 
            onClick={() => setShowWithdrawModal(true)}
            className="bg-white text-editorial-navy border border-editorial-navy font-bold py-4 px-4 rounded-sm text-xs flex flex-col items-center justify-center gap-1 active:scale-95 transition-transform"
          >
            <div className="flex items-center gap-2">
              <ArrowDownLeft size={16} />
              <span>{t('withdrawApply')}</span>
            </div>
          </button>
          <p className="text-[8px] text-gray-400 font-bold leading-none text-center">
            {t('withdrawNote')}
          </p>
        </div>
      </div>

      {/* Portfolio Distribution */}
      <section className="bg-white p-5 rounded-sm border border-gray-100 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <div className="text-[10px] font-bold uppercase tracking-widest text-editorial-navy/60">{t('assetDist')}</div>
          <div className="flex items-center gap-1.5 bg-gray-50 px-2 py-0.5 rounded border border-gray-100">
            <ShieldCheck size={10} className="text-editorial-gold" />
            <span className="text-[9px] font-bold text-editorial-navy/70 uppercase tracking-tighter">{t('audited')}</span>
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-[10px] font-bold mb-1.5 px-0.5">
              <span>{t('protocolPool')}</span>
              <span>100%</span>
            </div>
            <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-editorial-navy w-full" />
            </div>
          </div>
          <p className="text-[9px] text-gray-400 leading-relaxed italic border-l-2 border-editorial-gold pl-3">
            {t('campaignNote')}
          </p>
        </div>
      </section>

      {/* Recent Activity Mini List */}
      <section>
        <div className="px-1 flex justify-between items-center mb-4">
          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{t('recentEarnings')}</div>
          <button onClick={() => setActiveTab('history')} className="text-[9px] font-bold text-editorial-gold uppercase tracking-widest">{t('viewAll')}</button>
        </div>
        <div className="space-y-2">
          {!isNewUser && earningsHistory.length > 0 ? (
            earningsHistory.slice(0, 3).map((item, idx) => (
              <div key={idx} className="bg-white p-4 flex items-center justify-between border border-gray-100 rounded shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center">
                    <TrendingUp size={14} className="text-editorial-green" />
                  </div>
                  <div>
                    <div className="text-xs font-black">{item.amount} USDT</div>
                    <div className="text-[9px] text-gray-400 font-mono italic">{item.date}{item.time ? ` ${item.time}` : ''}</div>
                  </div>
                </div>
                <div className="text-[8px] font-bold text-editorial-green uppercase tracking-tighter bg-green-50 px-1.5 py-0.5 rounded">
                  {t('accrued')}
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white/50 p-8 rounded-lg border border-dashed border-gray-200 flex flex-col items-center justify-center text-center">
              <History size={24} className="text-gray-200 mb-2" />
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                {t('historyEmpty')}
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );

  const renderHistory = () => (
    <div className="p-6 animate-in fade-in duration-300">
      <div className="flex items-center gap-4 mb-6">
        <button 
          onClick={() => setActiveTab('home')}
          className="w-10 h-10 rounded-full bg-editorial-navy/5 flex items-center justify-center text-editorial-navy active:scale-95 transition-transform"
        >
          <ArrowLeft size={18} />
        </button>
        <h2 className="text-lg font-black italic tracking-tight uppercase flex-1">{t('historyTitle')}</h2>
        <History size={18} className="text-editorial-gold" />
      </div>

      {/* Tab Switcher */}
      <div className="flex border-b border-gray-100 mb-6 font-bold">
        <button 
          onClick={() => setHistoryTab('earnings')}
          className={`flex-1 pb-3 text-[11px] uppercase tracking-widest transition-colors ${historyTab === 'earnings' ? 'text-editorial-gold border-b-2 border-editorial-gold' : 'text-gray-300'}`}
        >
          {t('earningRecords')}
        </button>
        <button 
          onClick={() => setHistoryTab('capital')}
          className={`flex-1 pb-3 text-[11px] uppercase tracking-widest transition-colors ${historyTab === 'capital' ? 'text-editorial-gold border-b-2 border-editorial-gold' : 'text-gray-300'}`}
        >
          {t('capitalChanges')}
        </button>
        <button 
          onClick={() => setHistoryTab('transactions')}
          className={`flex-1 pb-3 text-[11px] uppercase tracking-widest transition-colors ${historyTab === 'transactions' ? 'text-editorial-gold border-b-2 border-editorial-gold' : 'text-gray-300'}`}
        >
          {t('withdrawHistory')}
        </button>
      </div>

      <div className="space-y-3">
        {historyTab === 'earnings' ? (
          // Profit Records
          earningsHistory.length > 0 ? (
            earningsHistory.map((item, idx) => (
              <div key={idx} className="bg-white p-4 flex items-center justify-between border border-gray-50 rounded shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-300" style={{ animationDelay: `${idx * 50}ms` }}>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-gray-400 mb-1">{item.date}{item.time ? ` ${item.time}` : ''}</span>
                  <span className="text-xs font-black">{item.type}</span>
                </div>
                <span className="text-sm font-black text-editorial-green">{item.amount}</span>
              </div>
            ))
          ) : (
            <div className="py-20 text-center">
              <p className="text-[10px] text-gray-300 font-bold uppercase tracking-widest leading-loose">
                {t('noEarnings')}
              </p>
            </div>
          )
        ) : historyTab === 'capital' ? (
          // Capital Movements
          capitalHistory.length > 0 ? (
            capitalHistory.map((item, idx) => (
              <div key={idx} className="bg-white p-4 flex items-center justify-between border border-gray-50 rounded shadow-sm">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-gray-400 mb-1">{item.date}</span>
                  <span className="text-xs font-black">{item.type}</span>
                </div>
                <span className={`text-sm font-black ${item.color}`}>{item.amount}</span>
              </div>
            ))
          ) : (
             <div className="py-20 text-center">
              <p className="text-[10px] text-gray-300 font-bold uppercase tracking-widest">
                {t('noCapital')}
              </p>
            </div>
          )
        ) : (
          // Transactions History
          transactions.length > 0 ? (
            transactions.map((tx, idx) => (
              <div key={idx} className="bg-white p-4 flex items-center justify-between border border-gray-50 rounded shadow-sm">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black">
                      {tx.type === 'withdrawal' ? 'Withdraw USDT' : 'Deposit USDT'}
                    </span>
                    <span className={`text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded ${
                      tx.status === 'pending' ? 'bg-yellow-500/10 text-yellow-600' : 
                      tx.status === 'completed' ? 'bg-green-500/10 text-green-600' : 
                      'bg-red-500/10 text-red-600'
                    }`}>
                      {t(`status${tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}`)}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-gray-400">
                    {tx.timestamp?.toDate ? tx.timestamp.toDate().toLocaleString() : 'Processing...'}
                  </span>
                  {tx.address && (
                    <span className="text-[8px] font-mono text-gray-300 truncate max-w-[150px]">{tx.address}</span>
                  )}
                </div>
                <span className={`text-sm font-black ${tx.type === 'withdrawal' ? 'text-gray-900' : 'text-editorial-green'}`}>
                  {tx.type === 'withdrawal' ? '-' : '+'}{tx.amount?.toLocaleString()}
                </span>
              </div>
            ))
          ) : (
            <div className="py-20 text-center">
              <p className="text-[10px] text-gray-300 font-bold uppercase tracking-widest">
                {t('historyEmpty')}
              </p>
            </div>
          )
        )}
      </div>
    </div>
  );

  const renderSettings = () => {
    if (activeSettingsView === 'language') {
      return (
        <div className="p-6 animate-in slide-in-from-right-4 duration-300">
          <button onClick={() => setActiveSettingsView('main')} className="flex items-center gap-1 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-6 active:scale-95 transition-transform">
            <ChevronRight size={14} className="rotate-180" />
            <span>{t('goBack')}</span>
          </button>
          <h2 className="text-lg font-black italic tracking-tight uppercase mb-8">{t('selectLanguage')}</h2>
          
          <div className="bg-white rounded-lg border border-gray-100 overflow-hidden shadow-sm">
            {LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => {
                  onLangChange(lang.code);
                  setActiveSettingsView('main');
                }}
                className={`w-full flex items-center justify-between p-5 border-b border-gray-100 last:border-0 active:bg-gray-50 transition-colors ${currentLang === lang.code ? 'bg-editorial-navy/5' : ''}`}
              >
                <div className="flex items-center gap-4">
                  <img 
                    src={`https://flagcdn.com/w40/${lang.flag}.png`} 
                    alt={lang.name}
                    className="w-8 h-5 object-cover rounded shadow-sm"
                    referrerPolicy="no-referrer"
                  />
                  <div className="text-left">
                    <div className={`text-[11px] font-black uppercase tracking-wider ${currentLang === lang.code ? 'text-editorial-gold' : 'text-editorial-navy'}`}>{lang.code}</div>
                    <div className="text-[9px] text-gray-400 font-bold">{lang.name}</div>
                  </div>
                </div>
                {currentLang === lang.code && <Check size={16} className="text-editorial-gold" />}
              </button>
            ))}
          </div>
        </div>
      );
    }
    if (activeSettingsView === 'security') {
      return (
        <div className="p-6 animate-in slide-in-from-right-4 duration-300">
          <button onClick={() => setActiveSettingsView('main')} className="flex items-center gap-1 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-6 active:scale-95 transition-transform">
            <ChevronRight size={14} className="rotate-180" />
            <span>{t('goBack')}</span>
          </button>
          <h2 className="text-lg font-black italic tracking-tight uppercase mb-8">{t('accountSecurity')}</h2>
          
          <div className="space-y-6">
            <div className="bg-white p-5 rounded border border-gray-100 shadow-sm">
              <h3 className="text-[11px] font-black uppercase tracking-widest mb-3 flex items-center gap-2">
                <Lock size={14} className="text-editorial-gold" />
                {t('loginPassword')}
              </h3>
              <p className="text-[10px] text-gray-400 mb-4 leading-relaxed">
                {t('passNote')}
              </p>
              <button className="w-full py-3 border border-editorial-navy text-editorial-navy font-bold text-[10px] uppercase tracking-widest active:bg-editorial-navy active:text-white transition-all">
                {t('changePass')}
              </button>
            </div>

            <div className="bg-white p-5 rounded border border-gray-100 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-green-50 rounded-full -mr-12 -mt-12 blur-2xl opacity-50"></div>
              <h3 className="text-[11px] font-black uppercase tracking-widest mb-3 flex items-center gap-2">
                <ShieldCheck size={14} className="text-editorial-green" />
                {t('twoFactor')}
              </h3>
              <p className="text-[10px] text-editorial-navy font-bold mb-4 leading-relaxed">
                {t('googleAuthLinked')}
              </p>
              <div className="bg-editorial-white p-3 rounded text-[9px] text-editorial-gray leading-relaxed border-l-2 border-editorial-green">
                {t('twoFactorNote')}
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (activeSettingsView === 'wallet') {
      return (
        <div className="p-6 animate-in slide-in-from-right-4 duration-300">
          <button onClick={() => setActiveSettingsView('main')} className="flex items-center gap-1 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-6 active:scale-95 transition-transform">
            <ChevronRight size={14} className="rotate-180" />
            <span>{t('goBack')}</span>
          </button>
          <h2 className="text-lg font-black italic tracking-tight uppercase mb-8">{t('linkedWallet')}</h2>
          
          <div className="space-y-6">
            <div className="bg-white p-6 rounded border border-gray-100 shadow-sm">
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">
                {t('usdtAddress')}
              </label>
              <div className="relative mb-4">
                <input 
                  type="text" 
                  value={walletAddress}
                  onChange={(e) => setWalletAddress(e.target.value)}
                  className="w-full bg-editorial-white border border-editorial-border py-4 px-4 rounded text-[10px] font-mono font-bold focus:outline-none focus:border-editorial-navy transition-colors"
                  placeholder="0x..."
                />
              </div>
              <p className="text-[9px] text-gray-400 leading-relaxed italic mb-6">
                {t('walletNote')}
              </p>
              
              <div className="bg-amber-50 p-4 rounded border border-amber-100">
                <div className="flex items-center gap-2 text-amber-700 font-black text-[10px] uppercase mb-2">
                  <ShieldAlert size={14} />
                  {t('addressLock')}
                </div>
                <p className="text-[9px] text-amber-800 leading-relaxed font-bold">
                  {t('lockNote')}
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="p-6 animate-in fade-in duration-300">
        <div className="flex items-center gap-4 mb-8">
          <button 
            onClick={() => setActiveTab('home')}
            className="w-10 h-10 rounded-full bg-editorial-navy/5 flex items-center justify-center text-editorial-navy active:scale-95 transition-transform"
          >
            <ArrowLeft size={18} />
          </button>
          <h2 className="text-lg font-black italic tracking-tight uppercase flex-1">{t('settingsAdmin')}</h2>
          <Settings size={18} className="text-editorial-gold" />
        </div>

        <div className="bg-white rounded-lg border border-gray-100 overflow-hidden shadow-sm">
          {userProfile && (
            <div className="p-5 border-b border-gray-100 bg-gray-50/50">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${userProfile.method === 'line' ? 'bg-editorial-green text-white' : 'bg-editorial-navy text-white'}`}>
                  {userProfile.method === 'line' ? <MessageCircle size={24} /> : userProfile.method === 'google' ? <Globe size={24} /> : <User size={24} />}
                </div>
                <div>
                  <div className="text-xs font-black uppercase tracking-widest leading-none mb-1">{userProfile.name}</div>
                  <div className="text-[10px] text-editorial-gray font-bold uppercase tracking-widest flex items-center gap-1">
                    {userProfile.method === 'line' ? (
                      <span className="flex items-center gap-1 text-editorial-green">
                        <Check size={10} className="stroke-[3]" /> {t('lineLinked')}
                      </span>
                    ) : userProfile.method === 'google' ? (
                      <span className="flex items-center gap-1 text-editorial-navy font-black">
                        <ShieldCheck size={10} /> {t('googleSecure')}
                      </span>
                    ) : (
                      <span>{t('emailMember')}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
          {[
            ...(userProfile?.role === 'admin' ? [{ id: 'admin', icon: <LayoutDashboard size={16} />, label: t('adminPanel'), sub: t('memberManagement') }] : []),
            { id: 'security', icon: <Lock size={16} />, label: t('accountSecurity'), sub: t('password') + "・2FA" },
            { id: 'wallet', icon: <Shield size={16} />, label: t('linkedWallet'), sub: walletAddress || t('notSet') },
            { id: 'language', icon: <Globe size={16} />, label: t('selectLanguage'), sub: LANGUAGES.find(l => l.code === currentLang)?.name },
            { id: 'notifications', icon: <Clock size={16} />, label: t('notificationSettings'), sub: t('systemAlerts') },
            { id: 'tos', icon: <ExternalLink size={16} />, label: t('terms'), sub: "" },
          ].map((item, idx) => (
            <button 
              key={idx} 
              onClick={() => {
                if (item.id === 'admin') {
                  onAdminPanel();
                }
                else if (item.id === 'security' || item.id === 'wallet' || item.id === 'language') setActiveSettingsView(item.id as any);
              }}
              className="w-full flex items-center justify-between p-5 border-b border-gray-100 last:border-0 active:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="text-editorial-gold">{item.icon}</div>
                <div className="text-left">
                  <div className="text-[11px] font-black uppercase tracking-wider">{item.label}</div>
                  {item.sub && <div className="text-[9px] text-gray-400 font-bold truncate max-w-[180px]">{item.sub}</div>}
                </div>
              </div>
              <ChevronRight size={14} className="text-gray-200" />
            </button>
          ))}
        </div>

        <div className="mt-12">
          <button 
            onClick={() => setShowLogoutModal(true)}
            className="w-full bg-editorial-navy text-white font-black py-4 rounded text-xs uppercase tracking-[0.2em] shadow-lg shadow-editorial-navy/10 active:scale-95 transition-transform flex items-center justify-center gap-2"
          >
            <span>{t('logout')}</span>
          </button>
          <p className="text-center text-[9px] text-gray-300 font-bold mt-4 uppercase tracking-[0.2em]">Version 0.8.2 Alpha</p>
        </div>
      </div>
    );
  };

  const renderInvite = () => {
    return (
      <div className="p-6 animate-in fade-in duration-300">
        <div className="flex items-center gap-4 mb-8">
          <button 
            onClick={() => setActiveTab('home')}
            className="w-10 h-10 rounded-full bg-editorial-navy/5 flex items-center justify-center text-editorial-navy active:scale-95 transition-transform"
          >
            <ArrowLeft size={18} />
          </button>
          <h2 className="text-lg font-black italic tracking-tight uppercase flex-1">{t('inviteFriends')}</h2>
          <Users size={18} className="text-editorial-gold" />
        </div>

        {/* Exclusive Referral Code */}
        <div className="bg-white p-6 rounded border border-gray-100 shadow-sm mb-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-editorial-gold/5 rounded-full -mr-16 -mt-16 blur-3xl opacity-50"></div>
          <div className="relative z-10">
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">{t('inviteCodeLabel')}</div>
            <div className="flex items-center justify-between bg-gray-50 p-4 rounded border-2 border-dashed border-gray-100 group">
              <span className="text-xl font-black tracking-tighter text-editorial-navy">{userProfile?.referralCode || '----'}</span>
              <button 
                onClick={() => handleCopy(userProfile?.referralCode || '')}
                className="p-2 bg-white rounded shadow-sm hover:text-editorial-gold transition-colors active:scale-95"
              >
                {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
              </button>
            </div>
            <p className="mt-4 text-[9px] text-gray-400 font-bold leading-relaxed">
              {t('inviteNote')}
            </p>
          </div>
        </div>

        {/* Progress Tracker */}
        <div className="bg-editorial-navy p-6 rounded shadow-xl mb-6 relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex justify-between items-end mb-3">
              <div className="text-[10px] font-black text-editorial-gold uppercase tracking-[0.2em]">{t('referralProgress')}</div>
              <div className="text-[10px] font-black text-white italic">{t('inviteRemaining', { n: remainingForBonus })}</div>
            </div>
            <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden mb-2">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${(currentProgress / inviteGoal) * 100}%` }}
                className="h-full bg-editorial-gold transition-all duration-1000"
              />
            </div>
            <div className="flex justify-between text-[8px] font-bold text-white/40 uppercase tracking-widest">
              <span>Progress</span>
              <span>{Math.round((currentProgress / inviteGoal) * 100)}%</span>
            </div>
          </div>
        </div>

        {/* One Click Share */}
        <button 
          onClick={handleLineInvite}
          className="w-full bg-[#06C755] text-white py-4 rounded-sm shadow-[0_4px_14px_rgba(6,199,85,0.2)] flex items-center justify-center gap-3 active:scale-95 transition-all mb-8"
        >
          <MessageCircle size={20} />
          <span className="text-xs font-black uppercase tracking-widest leading-none">{t('lineInvite')}</span>
        </button>

        {/* Invitation List */}
        <div>
          <div className="flex justify-between items-center mb-4 px-1">
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{t('inviteSuccessList')}</h3>
            <span className="text-[10px] font-black text-editorial-navy">{t('totalReward')}: ${totalReferralBonusAmount.toFixed(2)}</span>
          </div>
          <div className="space-y-2">
            {referrals.length > 0 ? (
              referrals.map((friend, idx) => (
                <div key={idx} className="bg-white p-4 flex items-center justify-between border border-gray-100 rounded shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-editorial-navy/5 flex items-center justify-center">
                      <User size={14} className="text-editorial-navy/60" />
                    </div>
                    <div>
                      <div className="text-xs font-black">{maskName(friend.name || "User")}</div>
                      <div className="text-[8px] text-gray-300 font-mono tracking-tighter uppercase">{new Date(friend.timestamp?.toDate ? friend.timestamp.toDate() : friend.timestamp).toLocaleDateString()} {t('joined')}</div>
                    </div>
                  </div>
                  <div className="text-[10px] font-black text-editorial-green">
                     +${friend.rewardAmount?.toFixed(1) || "0.0"}
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white py-12 flex flex-col items-center justify-center text-center rounded border border-dashed border-gray-200">
                <Users size={24} className="text-gray-200 mb-2" />
                <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest leading-relaxed">
                  {t('noFriendsYet')}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const handleConfirmedLogout = () => {
    onLogout();
    setShowLogoutModal(false);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] font-sans pb-24 text-editorial-navy">
      {/* Top Header - Unified for Home/History/Settings background coverage */}
      <div className={`bg-[#002D62] px-6 py-4 text-white relative transition-all duration-500 ${activeTab !== 'home' ? 'h-16' : ''}`}>
        {/* Decorative background container (overflow-hidden to clip blur elements) */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
          {activeTab === 'home' && (
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full -ml-32 -mb-32 blur-3xl opacity-50"></div>
          )}
        </div>
        
        <div className="flex justify-between items-center mb-4 relative z-10">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => {
                if (activeTab === 'home') {
                  onBack();
                } else {
                  setActiveTab('home');
                  setActiveSettingsView('main');
                }
              }}
              className="flex items-center justify-center w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 active:scale-90 transition-all text-white/60 hover:text-white"
              title={`${t('back')} (Back)`}
            >
              <ArrowLeft size={16} />
            </button>
            {userProfile && (
              <div className="flex items-center gap-2">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${userProfile.method === 'line' ? 'bg-editorial-green' : 'bg-editorial-gold'} text-white`}>
                  {userProfile.method === 'line' ? <MessageCircle size={14} /> : <User size={14} />}
                </div>
                <div className="text-[10px] font-black uppercase tracking-widest">{userProfile.name}</div>
              </div>
            )}
            <div className="h-4 w-[1px] bg-white/10"></div>
            <div className="text-[10px] font-black tracking-widest uppercase opacity-40">
              {activeTab === 'home' ? t('assets') : activeTab === 'history' ? t('history') : activeTab === 'invite' ? t('invite') : t('settings')}
            </div>
          </div>
          {activeTab === 'home' && (
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setShowSecurityModal(true)}
                className="flex items-center gap-1.5 bg-white/10 px-2 py-1 rounded-full backdrop-blur-sm border border-white/10 active:scale-95 transition-transform"
              >
                <motion.div 
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="w-1.5 h-1.5 bg-green-400 rounded-full"
                />
                <span className="text-[9px] font-bold text-green-400 uppercase tracking-widest">{t('authenticated')}</span>
              </button>
            </div>
          )}
          {activeTab !== 'home' && (
            <div className="flex items-center gap-3">
              <div className="text-[10px] font-black italic tracking-widest uppercase text-editorial-gold">KIZUNA PREP LAB</div>
            </div>
          )}
        </div>

        {activeTab === 'home' && (
          <>

            <div className="text-center mb-3 relative z-10">
              <div className="flex flex-col items-center gap-1 mb-1.5">
                <div className="text-[10px] font-bold text-editorial-gold uppercase tracking-[0.2em]">{t('totalBalance')}</div>
                <div className="bg-white/10 px-2 py-0.5 rounded-sm border border-white/10 backdrop-blur-sm">
                  <span className="text-[7px] font-black text-white/40 uppercase tracking-widest">{t('minThreshold')}</span>
                </div>
              </div>
              <div className="text-4xl font-black italic tracking-tighter flex items-center justify-center gap-2 mb-0.5">
                <NumberCounter value={displayTotalBalance} precision={2} />
                <span className="text-sm font-bold opacity-40 not-italic">USDT</span>
              </div>
              <div className="text-[9px] text-white/50 font-bold">
                {!isNewUser ? `${t('principalTotal')}: ${principalBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })} USDT` : t('newUserNotification')}
              </div>
              
              {/* Portfolio Breakdown (Internal Labels) */}
              {principalBalance > 0 && (
                <div className="mt-3 grid grid-cols-2 gap-2 max-w-[200px] mx-auto opacity-80">
                  <div className="border border-white/10 rounded px-2 py-1 text-left">
                    <div className="text-[7px] text-white/40 uppercase font-black">{t('capitalRatio')}</div>
                    <div className="text-[10px] font-mono font-bold leading-none">{( (principalBalance / displayTotalBalance) * 100 ).toFixed(1)}%</div>
                  </div>
                  <div className="border border-white/10 rounded px-2 py-1 text-left">
                    <div className="text-[7px] text-white/40 uppercase font-black">{t('growthRatio')}</div>
                    <div className="text-[10px] font-mono font-bold leading-none">{( (totalEarnings / displayTotalBalance) * 100 ).toFixed(1)}%</div>
                  </div>
                </div>
              )}

              {/* Mini Growth Curve */}
              {principalBalance > 0 && (
                <div className="mt-2 flex justify-center">
                  <div className="w-24 h-6 opacity-60">
                    <svg viewBox="0 0 100 30" className="w-full h-full overflow-visible">
                      <motion.path
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        d="M0,25 Q10,22 20,24 T40,18 T60,15 T80,10 T100,2"
                        fill="none"
                        stroke="#E5C787"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                      />
                      <motion.circle 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.2 }}
                        cx="100" cy="2" r="3" fill="#E5C787" 
                      />
                    </svg>
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-3 gap-2 border-t border-white/10 pt-4 relative z-10">
              <div className="text-center">
                <div className="text-[8px] font-bold text-white/50 uppercase tracking-wider mb-0.5 px-1 leading-tight">{t('yesterdayYield')}</div>
                <motion.div 
                  animate={{ 
                    y: [1, 0, 0, 0],
                    opacity: [0.7, 1, 1, 0.7]
                  }}
                  transition={{ 
                    repeat: Infinity, 
                    duration: 3,
                    times: [0, 0.1, 0.8, 1] 
                  }}
                  className="text-xs font-black text-green-400"
                >
                  {!isNewUser ? `+$${yesterdayEarnings.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "$0.00"}
                </motion.div>
              </div>
              <div className="text-center border-x border-white/10">
                <div className="text-[8px] font-bold text-white/50 uppercase tracking-wider mb-0.5 px-1 leading-tight">{t('totalYield')}</div>
                <div className="text-xs font-black text-white">{!isNewUser ? `+$${displayTotalEarnings.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "$0.00"}</div>
              </div>
              <div className="text-center">
                <div className="text-[8px] font-bold text-white/50 uppercase tracking-wider mb-0.5 px-1 leading-tight">{t('currentApy')}</div>
                <div className="text-xs font-black text-editorial-gold">{liveApy}%</div>
              </div>
            </div>
          </>
        )}
      </div>

      {activeTab === 'home' && renderHome()}
      {activeTab === 'history' && renderHistory()}
      {activeTab === 'invite' && renderInvite()}
      {activeTab === 'settings' && renderSettings()}

      {/* Floating Support Button */}
      {sysSettings.customerServiceUrl && (
        <a 
          href={sysSettings.customerServiceUrl}
          target="_blank"
          rel="noreferrer"
          className="fixed bottom-24 right-6 z-50 bg-[#06C755] text-white w-14 h-14 rounded-full shadow-[0_8px_30px_rgba(6,199,85,0.3)] flex items-center justify-center hover:scale-110 active:scale-95 transition-all"
        >
          <MessageCircle size={24} />
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-editorial-gold opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-editorial-gold"></span>
          </span>
        </a>
      )}

      {/* Support QR Floating Button */}
      {sysSettings.customerServiceQr && (
        <button 
          onClick={() => setShowSupportQrModal(true)}
          className="fixed bottom-40 right-6 z-50 bg-white text-editorial-navy w-14 h-14 rounded-full shadow-xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all border border-gray-100"
        >
          <QrCode size={24} />
        </button>
      )}

      {/* Support QR Modal */}
      <AnimatePresence>
        {showSupportQrModal && (
          <div className="fixed inset-0 z-[400] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSupportQrModal(false)}
              className="absolute inset-0 bg-editorial-navy/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-white p-8 rounded-2xl shadow-2xl max-w-xs w-full text-center"
            >
              <h3 className="text-sm font-black uppercase tracking-widest mb-6">{t('supportQrTitle')}</h3>
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 mb-6">
                <img src={sysSettings.customerServiceQr} alt="Customer Support QR" className="w-full aspect-square object-contain rounded-lg" />
              </div>
              <button 
                onClick={() => setShowSupportQrModal(false)}
                className="w-full py-4 bg-editorial-navy text-white text-[10px] font-black uppercase tracking-widest rounded-xl"
              >
                {t('close')}
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-8 py-4 flex justify-between items-center z-[100] shadow-[0_-5px_20px_rgba(0,0,0,0.05)]">
        <button 
          onClick={() => {
            setActiveTab('home');
            setActiveSettingsView('main');
          }} 
          className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'home' ? 'text-editorial-gold' : 'text-gray-300'}`}
        >
          <Home size={20} />
          <span className="text-[8px] font-bold uppercase tracking-wider">{t('home')}</span>
        </button>
        <button 
          onClick={() => {
            setActiveTab('history');
            setActiveSettingsView('main');
          }} 
          className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'history' ? 'text-editorial-gold' : 'text-gray-300'}`}
        >
          <History size={20} />
          <span className="text-[8px] font-bold uppercase tracking-wider">{t('history')}</span>
        </button>
        <button 
          onClick={() => {
            setActiveTab('invite');
            setActiveSettingsView('main');
          }} 
          className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'invite' ? 'text-editorial-gold' : 'text-gray-300'}`}
        >
          <Users size={20} />
          <span className="text-[8px] font-bold uppercase tracking-wider">{t('invite')}</span>
        </button>
        <button 
          onClick={() => setActiveTab('settings')} 
          className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'settings' ? 'text-editorial-gold' : 'text-gray-300'}`}
        >
          <Settings size={20} />
          <span className="text-[8px] font-bold uppercase tracking-wider">{t('settings')}</span>
        </button>
      </nav>

      {/* Security Status Modal */}
      <AnimatePresence>
        {showSecurityModal && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-6 text-editorial-navy">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSecurityModal(false)}
              className="absolute inset-0 bg-editorial-navy/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-white w-full max-w-sm rounded-lg overflow-hidden z-10 p-8 shadow-2xl"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-green-50 text-editorial-green rounded-full flex items-center justify-center">
                  <ShieldCheck size={24} />
                </div>
                <h3 className="text-lg font-black italic tracking-tight uppercase">{t('assetProtectionStatus')}</h3>
              </div>
              
              <div className="space-y-4 mb-8">
                <div className="p-4 bg-gray-50 rounded border border-gray-100 flex items-start gap-4">
                  <div className="mt-1"><Lock size={16} className="text-editorial-gold" /></div>
                  <div>
                    <div className="text-[11px] font-black uppercase tracking-wider mb-1">{t('scVerifiedTitle')}</div>
                    <p className="text-[10px] text-gray-400 leading-relaxed font-bold">{t('scVerifiedDesc')}</p>
                  </div>
                </div>
                
                <div className="p-4 bg-editorial-navy text-white rounded shadow-lg overflow-hidden relative">
                  <div className="absolute top-0 right-0 p-2 opacity-10"><Shield size={48} /></div>
                  <div className="relative z-10">
                    <div className="text-[11px] font-black uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
                       {t('auditedBy')}
                    </div>
                    <p className="text-[9px] text-white/70 leading-relaxed italic">
                      {t('auditProof')}
                    </p>
                  </div>
                </div>
              </div>
              
              <button 
                onClick={() => setShowSecurityModal(false)}
                className="w-full bg-editorial-navy text-white font-black py-4 rounded text-xs uppercase tracking-[0.2em] active:scale-95 transition-transform"
              >
                {t('close')}
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Logout Modal */}
      <AnimatePresence>
        {showLogoutModal && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-6 text-editorial-navy">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLogoutModal(false)}
              className="absolute inset-0 bg-editorial-navy/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-white w-full max-w-sm rounded-lg overflow-hidden z-10 p-8 text-center"
            >
              <div className="w-16 h-16 bg-editorial-navy/5 text-editorial-navy rounded-full flex items-center justify-center mx-auto mb-6">
                <Lock size={28} />
              </div>
              <h3 className="text-lg font-black mb-2 italic tracking-tight uppercase">{t('logoutConfirmTitle')}</h3>
              <p className="text-xs text-editorial-gray mb-8 leading-relaxed">
                {t('logoutConfirmDesc')}
              </p>
              <div className="flex flex-col gap-3">
                <button 
                  onClick={handleConfirmedLogout}
                  className="w-full bg-editorial-navy text-white font-black py-4 rounded text-xs uppercase tracking-[0.2em] active:scale-95 transition-transform"
                >
                  {t('logoutConfirmButton')}
                </button>
                <button 
                  onClick={() => setShowLogoutModal(false)}
                  className="w-full text-editorial-gray font-bold py-2 text-[10px] uppercase tracking-widest"
                >
                  {t('cancel')}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Deposit Modal */}
      <AnimatePresence>
        {showDepositModal && (
          <div className="fixed inset-0 z-[200] flex items-end md:items-center justify-center p-0 md:p-6 text-editorial-navy">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDepositModal(false)}
              className="absolute inset-0 bg-editorial-navy/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative bg-white w-full max-w-sm rounded-t-3xl md:rounded-lg overflow-hidden z-10 p-6 md:p-8"
            >
              {isDepositing ? (
                <div className="text-center py-10">
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    className="w-12 h-12 border-4 border-editorial-gold border-t-transparent rounded-full mx-auto mb-6"
                  />
                  <h3 className="text-lg font-black mb-2 italic tracking-tight uppercase">{t('checkingNetwork')}</h3>
                  <p className="text-[10px] text-editorial-gray font-bold uppercase tracking-widest">
                    {t('blockchainConfirm')}
                  </p>
                  <div className="mt-8 bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between text-[8px] font-bold text-gray-400 mb-2 uppercase">
                      <span>{t('status')}</span>
                      <span className="text-editorial-navy">{t('pending')} (1/3)</span>
                    </div>
                    <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: "65%" }}
                        transition={{ duration: 3 }}
                        className="h-full bg-editorial-gold"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="text-xl font-black italic tracking-tight uppercase leading-tight">{t('depositTitle')}</h3>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">{t('depositSubtitle')}</p>
                    </div>
                    <div className="p-2 bg-editorial-gold/10 text-editorial-gold rounded-full">
                      <Coins size={20} />
                    </div>
                  </div>

                  {/* Network Selection */}
                  <div className="bg-gray-50 p-1 rounded-sm flex mb-6">
                    {(['TRC20', 'ERC20'] as const).map((net) => (
                      <button
                        key={net}
                        onClick={() => setDepositNetwork(net)}
                        className={`flex-1 py-2 text-[10px] font-black tracking-widest uppercase transition-all rounded-sm ${
                          depositNetwork === net 
                            ? 'bg-editorial-navy text-white shadow-md' 
                            : 'text-gray-400 hover:text-editorial-navy'
                        }`}
                      >
                        {net}
                      </button>
                    ))}
                  </div>

                  {/* Amount Manual Input */}
                  <div className="mb-6">
                    <label className="block text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">
                      {t('depositAmount')}
                    </label>
                    <div className="relative group">
                      <input 
                        type="number"
                        value={depositInputAmount}
                        onChange={(e) => setDepositInputAmount(e.target.value)}
                        placeholder="0.00"
                        className="w-full bg-gray-50 border-2 border-transparent focus:border-editorial-navy/20 focus:bg-white transition-all py-4 px-4 pr-12 rounded text-lg font-black italic tracking-tight text-editorial-navy outline-none"
                      />
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-gray-300 pointer-events-none group-focus-within:text-editorial-gold transition-colors">
                        USDT
                      </div>
                    </div>
                  </div>

                  {/* Address Display */}
                  <div className="space-y-6">
                    <div className="text-center">
                      <div className="inline-block p-4 bg-gray-50 rounded-lg border border-gray-100 mb-4">
                        {/* QR Code Placeholder with dynamic generation */}
                        <div className="bg-white p-2 rounded shadow-inner">
                          {depositNetwork === 'TRC20' && sysSettings.qrCodeTrc20 ? (
                            <img 
                              src={sysSettings.qrCodeTrc20} 
                              alt="TRC20 QR Code"
                              className="w-32 h-32 md:w-40 md:h-40 object-contain"
                            />
                          ) : depositNetwork === 'ERC20' && sysSettings.qrCodeErc20 ? (
                            <img 
                              src={sysSettings.qrCodeErc20} 
                              alt="ERC20 QR Code"
                              className="w-32 h-32 md:w-40 md:h-40 object-contain"
                            />
                          ) : (
                            <img 
                              src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${depositAddresses[depositNetwork]}`}
                              alt="Deposit QR Code"
                              className="w-32 h-32 md:w-40 md:h-40"
                              referrerPolicy="no-referrer"
                            />
                          )}
                        </div>
                      </div>
                      <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mb-2">{t('qrCodeDesc')} ({depositNetwork})</p>
                      <div 
                        onClick={() => handleCopy(depositAddresses[depositNetwork])}
                        className="bg-gray-100 p-4 rounded border-2 border-dashed border-gray-200 cursor-pointer group active:bg-gray-200 transition-colors relative overflow-hidden"
                      >
                        <div className="font-mono text-[10px] md:text-[11px] font-bold break-all pr-8 text-editorial-navy">
                          {depositAddresses[depositNetwork]}
                        </div>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 group-hover:text-editorial-gold transition-colors">
                          {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                        </div>
                      </div>
                    </div>

                    <div className="bg-red-50 p-4 rounded border-l-4 border-red-500">
                      <p className="text-[9px] text-red-700 font-bold leading-relaxed">
                        {t('memoWarning')}
                      </p>
                    </div>

                    <div className="pt-2 space-y-3">
                      <button 
                        onClick={handleDepositConfirm}
                        disabled={!depositInputAmount || parseFloat(depositInputAmount) <= 0}
                        className="w-full bg-editorial-navy text-white font-black py-4 rounded text-xs uppercase tracking-[0.2em] shadow-lg shadow-editorial-navy/20 active:scale-95 transition-transform flex items-center justify-center gap-2 disabled:opacity-50 disabled:grayscale disabled:scale-100"
                      >
                        <ShieldCheck size={16} />
                        <span>{depositInputAmount ? `${parseFloat(depositInputAmount).toLocaleString()} USDT ${t('confirmDeposit')}` : t('depositAmount')}</span>
                      </button>
                      <button 
                        onClick={() => setShowDepositModal(false)}
                        className="w-full text-editorial-gray font-bold py-2 text-[10px] uppercase tracking-widest"
                      >
                        {t('cancel')}
                      </button>
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Withdraw Modal */}
      <AnimatePresence>
        {showWithdrawModal && (
          <div className="fixed inset-0 z-[200] flex items-end md:items-center justify-center p-0 md:p-6 text-editorial-navy">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !isWithdrawing && setShowWithdrawModal(false)}
              className="absolute inset-0 bg-editorial-navy/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative bg-white w-full max-w-sm rounded-t-3xl md:rounded-lg overflow-hidden z-10 p-6 md:p-8"
            >
              {isWithdrawing ? (
                <div className="text-center py-10">
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    className="w-12 h-12 border-4 border-editorial-gold border-t-transparent rounded-full mx-auto mb-6"
                  />
                  <h3 className="text-lg font-black mb-2 italic tracking-tight">{t('checkingNetwork')}</h3>
                  <p className="text-xs text-editorial-gray">{t('blockchainConfirm')}</p>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="text-xl font-black italic tracking-tight uppercase leading-tight">{t('withdraw')}</h3>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">{t('assets')}</p>
                    </div>
                    <div className="p-2 bg-editorial-navy/5 text-editorial-navy rounded-full">
                      <ArrowUpRight size={20} />
                    </div>
                  </div>

                  <div className="space-y-5">
                    {/* Network Selection */}
                    <div>
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">{t('withdrawalNetwork')}</label>
                      <div className="bg-gray-50 p-1 rounded-sm flex">
                        {(['TRC20', 'ERC20'] as const).map((net) => (
                          <button
                            key={net}
                            onClick={() => setWithdrawNetwork(net)}
                            className={`flex-1 py-1.5 text-[9px] font-black tracking-widest uppercase transition-all rounded-sm ${
                              withdrawNetwork === net 
                                ? 'bg-editorial-navy text-white shadow-md' 
                                : 'text-gray-400 hover:text-editorial-navy'
                            }`}
                          >
                            {net}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Amount Input */}
                    <div>
                      <div className="flex justify-between items-end mb-2">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{t('withdrawalAmount')}</label>
                        <div className="text-[10px] font-bold text-editorial-navy/60">
                          {t('available')}: <span className="font-black text-editorial-navy">${displayTotalBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                        </div>
                      </div>
                      <div className="relative">
                        <input 
                          type="number" 
                          value={withdrawAmount}
                          onChange={(e) => setWithdrawAmount(e.target.value)}
                          placeholder="0.00"
                          className="w-full bg-gray-50 border border-gray-100 p-4 rounded text-sm font-black italic focus:outline-none focus:border-editorial-gold transition-colors"
                        />
                        <button 
                          onClick={() => setWithdrawAmount(displayTotalBalance.toFixed(2))}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-[9px] font-black uppercase text-editorial-gold tracking-widest"
                        >
                          {t('max')}
                        </button>
                      </div>
                    </div>

                    {/* Address Input */}
                    <div>
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">{t('withdrawalAddress')}</label>
                      <input 
                        type="text" 
                        value={withdrawAddress}
                        onChange={(e) => setWithdrawAddress(e.target.value)}
                        placeholder={t('withdrawPlaceholder', { network: withdrawNetwork })}
                        className="w-full bg-gray-50 border border-gray-100 p-4 rounded text-[11px] font-mono focus:outline-none focus:border-editorial-gold transition-colors"
                      />
                    </div>

                    <div className="space-y-3 bg-gray-50 p-4 rounded border border-gray-100">
                      <div className="flex justify-between items-center text-[10px]">
                        <span className="text-gray-400 font-bold uppercase tracking-widest">{t('fee')}</span>
                        <span className="font-black text-editorial-green italic">{t('free')}</span>
                      </div>
                      <div className="flex justify-between items-center text-[10px]">
                        <span className="text-gray-400 font-bold uppercase tracking-widest">{t('arrival')}</span>
                        <span className="font-black text-editorial-navy italic">{t('within24h')}</span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-3 pt-2">
                      <button 
                        onClick={handleWithdraw}
                        disabled={!withdrawAddress || !withdrawAmount || parseFloat(withdrawAmount) <= 0 || parseFloat(withdrawAmount) > displayTotalBalance}
                        className="w-full bg-editorial-navy text-white font-black py-4 rounded text-xs uppercase tracking-[0.2em] shadow-lg shadow-editorial-navy/20 active:scale-95 transition-transform disabled:opacity-30 disabled:pointer-events-none"
                      >
                        {t('confirmWithdraw')}
                      </button>
                      <button 
                        onClick={() => setShowWithdrawModal(false)}
                        className="w-full text-editorial-gray font-bold py-2 text-[10px] uppercase tracking-widest"
                      >
                        {t('cancel')}
                      </button>
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function App() {
  const currentLangRef = React.useRef("jp");
  const [view, setView] = useState<'landing' | 'dashboard' | 'admin'>('landing');
  const [currentLang, setCurrentLang] = useState("jp");
  
  // Auto-detect language based on IP or Browser
  useEffect(() => {
    const detectLanguage = async () => {
      try {
        // 1. Check if user has already manually selected a language
        const savedLang = localStorage.getItem('selected_language');
        if (savedLang && LANGUAGES.some(l => l.code === savedLang)) {
          setCurrentLang(savedLang);
          return;
        }

        // 2. Try IP-based detection (most accurate for "Country IP")
        try {
          const response = await fetch('https://ipapi.co/json/');
          const data = await response.json();
          const countryCode = data.country_code?.toLowerCase();
          
          const countryMap: Record<string, string> = {
            'jp': 'jp', 'us': 'en', 'gb': 'en', 'ca': 'en', 'au': 'en',
            'tr': 'tr', 'cn': 'cn', 'tw': 'tw', 'hk': 'tw', 'mo': 'tw',
            'kr': 'kr', 'vn': 'vn', 'th': 'th', 'id': 'id', 'es': 'es',
            'mx': 'es', 'br': 'pt', 'pt': 'pt', 'sa': 'ar', 'ae': 'ar',
            'ru': 'ru', 'in': 'hi'
          };

          if (countryCode && countryMap[countryCode]) {
            setCurrentLang(countryMap[countryCode]);
            return;
          }
        } catch (ipErr) {
          console.warn("IP-based detection failed, falling back to browser language.");
        }

        // 3. Fallback to Browser language
        const browserLang = navigator.language.split('-')[0].toLowerCase();
        const browserMap: Record<string, string> = {
          'ja': 'jp', 'en': 'en', 'tr': 'tr', 'zh': navigator.language.toLowerCase().includes('tw') || navigator.language.toLowerCase().includes('hk') ? 'tw' : 'cn',
          'ko': 'kr', 'vi': 'vn', 'th': 'th', 'id': 'id', 'es': 'es', 'pt': 'pt', 'ar': 'ar', 'ru': 'ru', 'hi': 'hi'
        };

        if (browserMap[browserLang]) {
          setCurrentLang(browserMap[browserLang]);
        } else {
          setCurrentLang('en'); // Global default if everything else fails
        }
      } catch (err) {
        console.error("Language detection error:", err);
      }
    };

    detectLanguage();
  }, []);

  // Update localStorage when language changes
  useEffect(() => {
    if (currentLang) {
      localStorage.setItem('selected_language', currentLang);
    }
  }, [currentLang]);
  
  const t = (key: string, params?: Record<string, any>) => {
    let text = TRANSLATIONS[currentLang]?.[key] || TRANSLATIONS.en[key] || key;
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        text = text.replace(`{${k}}`, String(v));
      });
    }
    return text;
  };

  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [depositAmount, setDepositAmount] = useState<number | string>(10000);
  const [liveApy, setLiveApy] = useState(12.45);
  const [showTooltip, setShowTooltip] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authSuccess, setAuthSuccess] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [inviteCodeInput, setInviteCodeInput] = useState("");
  const inviteCodeRef = React.useRef("");
  
  useEffect(() => {
    inviteCodeRef.current = inviteCodeInput;
  }, [inviteCodeInput]);
  
  // Real Account States (Synced via DashboardView effects)
  const [accountPrincipal, setAccountPrincipal] = useState(0);
  const [accountEarnings, setAccountEarnings] = useState(0);

  // Authentication State
  const [currentUserProfile, setCurrentUserProfile] = useState<{
    method: 'line' | 'email' | 'google' | null;
    name: string | null;
    uid: string;
    referralCode?: string;
    referralCount?: number;
    role?: 'user' | 'admin';
    customApy?: number;
  } | null>(null);

  // Auth Observer
  useEffect(() => {
    const unsub = auth.onAuthStateChanged(async (firebaseUser) => {
      console.log("Auth Event:", firebaseUser ? "Signed In" : "Signed Out");
      
      if (firebaseUser) {
        try {
          const userRef = doc(db, 'users', firebaseUser.uid);
          const snap = await getDoc(userRef);
          
          let profileData: any = null;
          if (snap.exists()) {
            profileData = snap.data();
            // Admin role override
            if (firebaseUser.email === "oopqwe001@gmail.com" && profileData.role !== "admin") {
              await setDoc(userRef, { role: "admin" }, { merge: true });
              profileData.role = "admin";
            }
          } else {
            // New user initialization
            const shortUid = firebaseUser.uid.substring(0, 4).toUpperCase();
            const referralCode = `KIZUNA-${shortUid}${Math.floor(1000 + Math.random() * 9000)}`;
            const role = firebaseUser.email === "oopqwe001@gmail.com" ? "admin" : "user";
            
            profileData = {
              uid: firebaseUser.uid,
              name: firebaseUser.displayName || (firebaseUser.email ? firebaseUser.email.split('@')[0] : 'Member'),
              email: firebaseUser.email,
              method: firebaseUser.providerData[0]?.providerId === 'google.com' ? 'google' : 'email',
              referralCode,
              referralCount: 0,
              referralBonus: 0,
              invitedByCode: inviteCodeRef.current || null,
              createdAt: serverTimestamp(),
              role,
              customApy: null
            };
            await setDoc(userRef, profileData);
          }

          setCurrentUserProfile({
            uid: firebaseUser.uid,
            name: profileData.name || 'User',
            method: profileData.method || 'email',
            referralCode: profileData.referralCode,
            referralCount: profileData.referralCount || 0,
            role: profileData.role || 'user',
            customApy: profileData.customApy
          });

          // Transition
          setView('dashboard');
          setShowAuthModal(false);
          setIsAuthenticating(false);
          setIsLoading(false);
        } catch (e) {
          console.error("Profile sync fail:", e);
          setView('dashboard');
          setIsLoading(false);
          setIsAuthenticating(false);
          setShowAuthModal(false);
        }
      } else {
        setCurrentUserProfile(null);
        setView('landing');
        setIsLoading(false);
        setIsAuthenticating(false);
        setShowAuthModal(false);
      }
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    // Scroll and Tooltip effects
    const handleScroll = () => {
      if (window.scrollY > 800) setShowTooltip(false);
    };
    window.addEventListener('scroll', handleScroll);
    const timer = setTimeout(() => setShowTooltip(false), 10000);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timer);
    };
  }, []);

  const handleAuthAction = async (method: 'line' | 'email' | 'google', e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setAuthError(null);
    setIsAuthenticating(true);
    
    console.log("Auth Initiated:", method);
    
    try {
      if (method === 'google') {
        await loginWithGoogle();
      } else if (method === 'line') {
        console.log("LINE Auth Initiated...");
        setShowAuthModal(false);
        setIsAuthenticating(false);
      } else {
        if (!email || !password) {
          setAuthError(t('emailValidationErr'));
          setIsAuthenticating(false);
          return;
        }

        if (isLoginMode) {
          await loginWithEmail(email, password);
        } else {
          await registerWithEmail(email, password);
        }
      }
    } catch (err: any) {
      console.error("Auth Error:", err);
      setIsAuthenticating(false);
      let message = t('authFailedErr');
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        message = t('authWrongPassErr');
      } else if (err.code === 'auth/email-already-in-use') {
        message = t('authEmailInUseErr');
      } else if (err.code === 'auth/weak-password') {
        message = t('authWeakPassErr');
      } else if (err.code === 'auth/invalid-email') {
        message = t('authInvalidEmailErr');
      }
      setAuthError(message);
      setAuthSuccess(false);
    }
  };

  const handleLogout = () => {
    firebaseLogout();
  };

  const calculateYield = (amount: number, apy: number) => {
    // Current live yield for annual
    const annual = amount * (apy / 100);
    // Conservative 8.5% floor for monthly simulation
    const monthlyConservative = amount * (8.5 / 100) / 12;
    return { annual, monthly: monthlyConservative };
  };

  const amountValue = typeof depositAmount === 'string' ? parseFloat(depositAmount) || 0 : depositAmount;
  const { annual, monthly } = calculateYield(amountValue, liveApy);

  const referralBonusApy = Math.floor((currentUserProfile?.referralCount || 0) / 3) * 0.5;
  const baseApy = currentUserProfile?.customApy || liveApy;
  const totalApy = baseApy + referralBonusApy;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-editorial-white flex flex-col items-center justify-center">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-12 h-12 border-4 border-editorial-navy border-t-editorial-gold rounded-full"
        />
        <p className="mt-4 text-[10px] font-black uppercase tracking-[0.2em] text-editorial-navy opacity-40">{t('systemLoading')}</p>
      </div>
    );
  }

  return (
    <AnimatePresence>
        {view === 'admin' ? (
          <motion.div 
            key="admin"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="min-h-screen"
          >
            <AdminPanelView 
              onBack={() => setView('dashboard')}
              currentLang={currentLang}
              liveApy={liveApy}
            />
          </motion.div>
        ) : view === 'dashboard' ? (
          <motion.div 
            key="dashboard"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="min-h-screen"
          >
            <DashboardView 
              onBack={() => setView('landing')} 
              onLogout={handleLogout}
              onAdminPanel={() => setView('admin')}
              userProfile={currentUserProfile}
              liveApy={totalApy} 
              onAccountUpdate={(p, e) => {
                setAccountPrincipal(p);
                setAccountEarnings(e);
              }}
              currentLang={currentLang}
              onLangChange={setCurrentLang}
            />
          </motion.div>
        ) : (
          <motion.div 
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="min-h-screen bg-editorial-white font-sans text-editorial-navy selection:bg-editorial-gold selection:text-white relative">
              {/* ... existing landing content ... */}
            {/* Floating Consultation Button */}
            <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end gap-2">
              <AnimatePresence>
                {showTooltip && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.8, x: 10 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.8, x: 10 }}
                    className="bg-editorial-navy text-white text-[10px] py-2 px-4 rounded-full shadow-xl font-bold mb-2 relative whitespace-nowrap"
                  >
                    {t('settings')}
                    <div className="absolute w-2 h-2 bg-editorial-navy rotate-45 -bottom-1 right-6"></div>
                  </motion.div>
                )}
              </AnimatePresence>
              
              <motion.a
                href="https://line.me/R/ti/p/@yourid"
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="w-14 h-14 bg-editorial-green rounded-full flex items-center justify-center shadow-[0_4px_10px_rgba(6,199,85,0.15)] md:w-16 md:h-16"
              >
                <div className="relative">
                  <motion.div 
                    animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="absolute inset-0 bg-white rounded-full"
                  />
                  <svg viewBox="0 0 24 24" className="w-8 h-8 md:w-10 md:h-10 fill-white relative z-10" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21.362 9.356c0-4.473-4.272-8.112-9.522-8.112s-9.522 3.639-9.522 8.112c0 4.01 3.39 7.369 7.979 7.97l-.503 1.884c-.06.223.279.431.479.227l2.844-3.52c.245-.03.488-.066.723-.109 4.272-.441 7.522-3.805 7.522-8.452zm-12.008 3.513c-.22 0-.4-.18-.4-.4v-4.008c0-.22.18-.4.4-.4s.4.18.4.4v4.008c0 .22-.18.4-.4.4zm2.846-4.008v4.008c0 .22-.18.4-.4.4s-.4-.18-.4-.4v-4.008c0-.22.18-.4.4-.4s.4.18.4.4zm4.444 4.008c0 .22-.18.4-.4.4h-1.64c-.22 0-.4-.18-.4-.4v-4.008c0-.22.18-.4.4-.4s.4.18.4.4v3.608h1.24c.22 0 .4.18.4.4zm2.843-4.008c0-.22-.18-.4-.4-.4h-1.641c-.22 0-.4.18-.4.4v4.008c0 .22.18.4.4.4h1.641c.22 0 .4-.18.4-.4s-.18-.4-.4-.4h-1.241v-1.2h1.241c.22 0 .4-.18.4-.4s-.18-.4-.4-.4h-1.241v-1.2h1.241c.22 0 .4-.18.4-.4z"/>
                  </svg>
                </div>
              </motion.a>
            </div>

            {/* Header - Optimized Height */}
            <header className="h-[50px] md:h-[60px] bg-white border-b-2 border-editorial-navy px-4 md:px-10 flex items-center justify-between sticky top-0 z-50">
              <div className="flex items-center gap-2">
                <div className="text-lg md:text-xl font-black tracking-tighter leading-none uppercase">
                  KIZUNA<span className="hidden md:inline"> {t('usdDefense')}</span>
                  <span className="ml-1.5 text-[9px] bg-editorial-navy text-white px-1.5 py-0.5 rounded-sm align-middle">
                    {t('prepLab')}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {currentUserProfile ? (
                  <button 
                    onClick={() => setView('dashboard')}
                    className="flex items-center gap-2 text-[10px] font-black px-4 py-2 bg-editorial-navy text-white rounded-sm hover:bg-editorial-navy/90 transition-all uppercase tracking-widest active:scale-95"
                  >
                    <User size={12} className="text-editorial-gold" />
                    {t('dashboard')}
                  </button>
                ) : (
                  <button 
                    onClick={() => {
                      setAuthSuccess(false);
                      setShowAuthModal(true);
                    }}
                    className="text-[10px] font-black px-4 py-2 bg-editorial-navy text-white rounded-sm hover:bg-editorial-navy/90 transition-all uppercase tracking-widest shadow-lg shadow-editorial-navy/10 active:scale-95"
                  >
                    {t('register')} / {t('login')}
                  </button>
                )}
                <span className="hidden lg:block text-gray-400 font-mono text-[9px]">VER 0.8.2 ALPHA</span>
              </div>
            </header>

            <main className="editorial-grid">
              {/* Column 1: Hero & Yield Comparison & Calculator */}
              <section className="col-span-1 md:col-span-4 editorial-hero editorial-section !p-2 md:!p-4 !pt-2">
                <div className="mb-1 md:mb-2">
                  <span className="block text-[7px] md:text-[8px] font-bold text-editorial-gold mb-0.5 uppercase tracking-widest">
                    {t('assetDefenseLabel')}
                  </span>
                  <h1 className="text-base md:text-2xl font-black italic leading-[1.1] md:leading-[1.1] tracking-tight mb-1 md:mb-2 whitespace-pre-line">
                    {t('heroTitle')}
                  </h1>
                  <p className="text-[8px] md:text-xs opacity-90 leading-relaxed mb-2 md:mb-3 max-w-full whitespace-pre-line">
                    {t('heroSubtitle')}
                  </p>
                </div>

                <div className="mt-0 md:mt-auto bg-white/5 border border-white/10 p-1.5 md:p-3 rounded-lg backdrop-blur-sm">
                  <div className="mb-2 md:mb-2 relative">
                    <div className="flex justify-between items-center">
                      <div className="text-[9px] md:text-[10px] text-white/80 uppercase tracking-wider">{t('annualYield')}</div>
                      <div className="flex items-center gap-1">
                        <motion.span 
                          animate={{ opacity: [1, 0.4, 1], scale: [1, 1.2, 1] }}
                          transition={{ repeat: Infinity, duration: 1.5 }}
                          className="w-0.5 h-0.5 bg-green-400 rounded-full"
                        />
                        <span className="text-[8px] md:text-[10px] font-bold text-green-400 uppercase">{t('liveIndicator')}: {liveApy}%</span>
                      </div>
                    </div>
                    <div className="h-0.5 md:h-1.5 w-full bg-white/10 rounded-full overflow-hidden my-0.5">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: "85%" }}
                        className="h-full bg-editorial-gold"
                      />
                    </div>
                    <div className="text-lg md:text-xl font-black italic tracking-tighter text-editorial-highlight leading-none">8.5% - 26.8%</div>
                  </div>

                  {/* Yield Calculator */}
                  <div className="mb-2 md:mb-3 bg-black/20 p-1.5 md:p-2 rounded border border-white/10">
                    <div className="text-[9px] md:text-[10px] font-bold text-editorial-gold mb-1.5 uppercase tracking-widest">{t('yieldSim')}</div>
                    <div className="flex flex-col gap-1.5">
                      <div>
                        <label className="block text-[8px] md:text-[9px] text-white/60 mb-0.5 font-bold uppercase">{t('depositAmount')}</label>
                        <div className="relative">
                          <input 
                            type="number" 
                            value={depositAmount}
                            onChange={(e) => setDepositAmount(e.target.value)}
                            className="w-full bg-white/10 border border-white/20 rounded py-2 px-3 text-sm font-bold text-white focus:outline-none focus:border-editorial-gold transition-colors appearance-none"
                            placeholder="10000"
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-white/40">USDT</span>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-white/5 p-1.5 rounded">
                          <div className="text-[8px] md:text-[9px] text-white/50 mb-0.5 leading-none font-bold uppercase tracking-tight">{t('oneMonth')}</div>
                          <div className="text-[12px] md:text-[14px] font-black text-editorial-highlight leading-none">+${monthly.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                        </div>
                        <div className="bg-white/5 p-1.5 rounded border border-editorial-gold/20">
                          <div className="text-[8px] md:text-[9px] text-white/50 mb-0.5 leading-none font-bold uppercase tracking-tight">{t('oneYear')}</div>
                          <div className="text-[12px] md:text-[14px] font-black text-editorial-highlight leading-none">+${annual.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
                        </div>
                      </div>
                      <button 
                        onClick={() => {
                          if (currentUserProfile) {
                            setView('dashboard');
                          } else {
                            setAuthSuccess(false);
                            setShowAuthModal(true);
                          }
                        }}
                        className="w-full bg-editorial-gold text-white font-black py-2.5 rounded-sm text-[10px] md:text-[11px] uppercase tracking-widest active:scale-95 transition-transform"
                      >
                        {currentUserProfile ? t('dashboard') : t('startNow')}
                      </button>
                    </div>
                  </div>

                  <div className="opacity-90">
                    <div className="text-[8px] md:text-[10px] text-white/60 mb-0.5 uppercase tracking-wider font-bold">{t('minThreshold')}</div>
                    <div className="h-0.5 w-full bg-white/10 rounded-full overflow-hidden mb-0.5">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: "1.5%" }}
                        className="h-full bg-white/40"
                      />
                    </div>
                    <div className="text-[10px] md:text-[11px] font-bold leading-none text-white/80">0.02%</div>
                  </div>
                </div>
              </section>

        {/* Column 2: Mechanism & Message */}
        <section className="col-span-1 md:col-span-4 bg-white editorial-section !p-0 md:!p-8 overflow-hidden">
          {/* Transparent Mechanism */}
          <div className="p-6 md:p-0">
            <SectionLabel>{t('stepLabel')}</SectionLabel>
            {/* Horizontal Scroll on Mobile - Width adjusted to peek next step explicitly */}
            <div className="flex md:block gap-4 overflow-x-auto md:overflow-visible pb-4 md:pb-0 scrollbar-hide snap-x snap-mandatory -mx-6 px-6 md:mx-0 md:px-0 mt-4">
              <div className="min-w-[65vw] md:min-w-0 snap-center">
                <StepItem 
                  num={1}
                  title={t('step1Title')}
                  description={t('step1Desc')}
                />
              </div>
              <div className="min-w-[65vw] md:min-w-0 snap-center">
                <StepItem 
                  num={2}
                  title={t('step2Title')}
                  description={t('step2Desc')}
                />
              </div>
              <div className="min-w-[65vw] md:min-w-0 snap-center">
                <StepItem 
                  num={3}
                  title={t('step3Title')}
                  description={t('step3Desc')}
                />
              </div>
            </div>
          </div>

          <div className="p-6 md:p-0 border-t md:border-0 border-editorial-border">
            {/* Mobile Toggle Button for Representative Message */}
            <div className="md:hidden">
              <button 
                onClick={() => setIsDetailsOpen(!isDetailsOpen)}
                className="w-full flex items-center justify-between p-4 bg-editorial-navy text-white font-bold rounded-sm text-xs shadow-[0_8px_20px_rgba(0,45,98,0.25)] border border-editorial-navy active:scale-[0.98] transition-all"
              >
                <span>{isDetailsOpen ? t('closeMsg') : t('readMsg')}</span>
                {isDetailsOpen ? <Minus size={14} /> : <Plus size={14} />}
              </button>
            </div>

            <div className={`${isDetailsOpen ? 'block' : 'hidden'} md:block mt-8 md:mt-2 animate-in fade-in slide-in-from-top-4 duration-500`}>
              <SectionLabel>{t('repLabel')}</SectionLabel>
              <div className="bg-editorial-white border-l-4 border-editorial-navy p-6 italic relative mb-4 md:mb-0">
                <p className="text-sm text-editorial-navy leading-loose mb-6 relative z-10">
                  {t('welcomeTitle')}
                </p>
                <div className="text-right">
                  <p className="text-[10px] md:text-xs font-bold text-editorial-navy italic">
                    {t('representative')} <span className="font-normal opacity-60 ml-1">{t('repDesc')}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Column 3: Safety, FAQ & CTA */}
        <section className="col-span-1 md:col-span-4 bg-white editorial-section !p-5 md:!p-8">
          <div className="mb-10 md:mb-12 relative overflow-hidden">
            <SectionLabel>{t('safetyLabel')}</SectionLabel>
            <div className="space-y-3 md:space-y-4 mb-4">
              <div className="editorial-card hover:border-editorial-navy group cursor-default">
                <div className="flex gap-3 md:gap-4 items-center">
                  <ShieldCheck className="text-editorial-navy group-hover:text-editorial-gold transition-colors" size={20} />
                  <h4 className="font-bold text-xs md:text-sm">{t('auditTitle')}</h4>
                </div>
                <p className="mt-2 text-[10px] md:text-xs text-editorial-gray leading-relaxed pl-8 md:pl-10">{t('auditDesc')}</p>
              </div>
              <div className="editorial-card hover:border-editorial-navy group cursor-default">
                <div className="flex gap-3 md:gap-4 items-center">
                  <LineChart className="text-editorial-navy group-hover:text-editorial-gold transition-colors" size={20} />
                  <h4 className="font-bold text-xs md:text-sm">{t('withdrawFreeTitle')}</h4>
                </div>
                <p className="mt-2 text-[10px] md:text-xs text-editorial-gray leading-relaxed pl-8 md:pl-10">{t('withdrawFreeDesc')}</p>
              </div>
            </div>
            {/* Safety Anchor Point */}
            <div className="flex items-center gap-2 text-editorial-gold font-bold text-[10.5px] md:text-xs animate-pulse">
              <Clock size={14} />
              <span>{t('withdrawFreeDesc')}</span>
            </div>
          </div>

          <div className="mb-10 md:mb-12">
            <SectionLabel>{t('faqLabel')}</SectionLabel>
            <div className="border-t border-editorial-border">
              <FAQItem 
                q={t('faqBankQ')}
                a={t('faqBankA')}
              />
              <FAQItem 
                q={t('faqRiskQ')}
                a={t('faqRiskA')}
              />
              <FAQItem 
                q={t('faqPlatformQ')}
                a={t('faqPlatformA')}
              />
            </div>
          </div>

          <div className="mt-auto border-t-2 border-editorial-navy pt-8 md:pt-10 text-center">
            <p className="text-xs md:text-sm font-black mb-4 md:mb-6 uppercase tracking-[0.2em]">{t('ctaTitle')}</p>
            <div className="flex flex-col gap-2.5 md:gap-3">
              <motion.button 
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowAuthModal(true)}
                className="bg-editorial-navy text-white font-bold py-3 md:py-4 px-6 rounded-sm text-xs md:text-sm border border-editorial-navy hover:bg-white hover:text-editorial-navy transition-all flex items-center justify-center gap-2"
              >
                {t('ctaButton')}
              </motion.button>
              <motion.button 
                animate={{ scale: [1, 1.015, 1] }}
                transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowAuthModal(true)}
                className="bg-editorial-green text-white font-bold py-3 md:py-4 px-6 rounded-sm text-xs md:text-sm border border-editorial-green hover:bg-white hover:text-editorial-green transition-all shadow-[0_4px_14px_rgba(6,199,85,0.2)]"
              >
                {t('lineCta')}
              </motion.button>
            </div>
            <p className="mt-6 md:mt-8 text-[9px] md:text-[10px] text-gray-400 px-2 leading-relaxed text-center opacity-80 italic">
              {t('securityFooter')}
            </p>
          </div>
        </section>
      </main>

      <footer className="bg-editorial-white pt-8 pb-12 px-6 md:px-10 border-t border-editorial-border">
        <div className="container mx-auto max-w-7xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-editorial-navy rounded-sm flex items-center justify-center text-white text-[9px] font-black italic">
                K
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">{t('kizunaLogoFull')}</span>
            </div>
            <span className="text-[8px] text-gray-400 font-mono tracking-widest leading-none">VER 0.8.2 ALPHA EDITION</span>
          </div>
          <p className="text-[9px] text-editorial-gray font-bold tracking-widest opacity-60 leading-none uppercase">
            &copy; {new Date().getFullYear()} KIZUNA LAB. {t('allRightsReserved')}
          </p>
        </div>
      </footer>

              {/* Registration/Auth Modal */}
              <AnimatePresence>
                {showAuthModal && (
                  <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={() => !authSuccess && setShowAuthModal(false)}
                      className="absolute inset-0 bg-editorial-navy/60 backdrop-blur-sm"
                    />
                    <motion.div 
                      initial={{ scale: 0.9, opacity: 0, y: 20 }}
                      animate={{ scale: 1, opacity: 1, y: 0 }}
                      exit={{ scale: 0.9, opacity: 0, y: 20 }}
                      className="relative bg-white w-full max-w-[340px] p-6 rounded shadow-2xl z-10"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <h2 className="text-xl font-black italic tracking-tighter uppercase leading-none">
                          {isLoginMode ? t('login') : t('register')}
                        </h2>
                        <button 
                          onClick={() => {
                            setShowAuthModal(false);
                            setAuthError(null);
                          }}
                          className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                        >
                          <X size={18} />
                        </button>
                      </div>
                      
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-6 leading-relaxed">
                        {t('welcome')}
                      </p>
                      
                      {authError && (
                        <div className="mb-4 p-3 bg-red-50 border-l-2 border-red-500 text-red-600 text-[10px] font-bold">
                          {authError}
                        </div>
                      )}

                      {authSuccess ? (
                        <div className="text-center py-8">
                          <motion.div 
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
                          >
                            <CheckCircle size={32} className="text-editorial-green" />
                          </motion.div>
                          <h3 className="text-lg font-black uppercase tracking-widest text-editorial-navy mb-2">{t('authSuccess')}</h3>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{t('authenticated')}</p>
                        </div>
                      ) : (
                        <div className="space-y-3 mb-6">
                            {/* Google Login - Real Firebase integration */}
                            <button 
                              onClick={() => handleAuthAction('google')}
                              disabled={isAuthenticating}
                              className="w-full bg-white border border-gray-200 py-3 rounded-sm shadow-sm flex items-center justify-center gap-3 active:scale-95 transition-all group disabled:opacity-50 disabled:cursor-wait"
                            >
                              <div className="bg-editorial-navy/5 p-1 rounded-full group-hover:bg-editorial-gold/10 transition-colors">
                                <Globe size={16} className="text-editorial-navy group-hover:text-editorial-gold transition-colors" />
                              </div>
                              <span className="text-[11px] font-black uppercase tracking-widest">
                                {isAuthenticating ? '...' : t('googleLogin')}
                              </span>
                            </button>

                            <button 
                              onClick={() => handleAuthAction('line')}
                              disabled={isAuthenticating}
                              className="w-full bg-editorial-green text-white py-3 rounded-sm shadow-[0_4px_14px_rgba(6,199,85,0.2)] flex items-center justify-center gap-3 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-wait"
                            >
                              <MessageCircle size={16} />
                              <span className="text-[11px] font-black uppercase tracking-widest">
                                {isAuthenticating ? '...' : t('lineLogin')}
                              </span>
                            </button>

                            <div className="flex items-center gap-4 py-1.5">
                              <div className="h-[1px] bg-gray-100 flex-1"></div>
                              <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest leading-none">{t('or')}</span>
                              <div className="h-[1px] bg-gray-100 flex-1"></div>
                            </div>

                            <form onSubmit={(e) => handleAuthAction('email', e)} className="space-y-3">
                              <div>
                                <label className="block text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1 ml-1">{t('email')}</label>
                                <input 
                                  type="email" 
                                  value={email}
                                  onChange={(e) => setEmail(e.target.value)}
                                  placeholder={t('emailPlaceholder')}
                                  className="w-full bg-gray-50 border border-gray-100 p-3 rounded text-xs font-bold focus:outline-none focus:border-editorial-navy transition-colors"
                                  required
                                />
                              </div>
                              <div>
                                <label className="block text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1 ml-1">{t('password')}</label>
                                <input 
                                  type="password" 
                                  value={password}
                                  onChange={(e) => setPassword(e.target.value)}
                                  placeholder={t('passwordPlaceholder')}
                                  className="w-full bg-gray-50 border border-gray-100 p-3 rounded text-xs font-bold focus:outline-none focus:border-editorial-navy transition-colors"
                                  required
                                  minLength={6}
                                />
                              </div>

                              {!isLoginMode && (
                                <div>
                                  <label className="block text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1 ml-1">{t('inviteCodeOptional')}</label>
                                  <input 
                                    type="text" 
                                    value={inviteCodeInput}
                                    onChange={(e) => setInviteCodeInput(e.target.value.toUpperCase())}
                                    placeholder={t('invitePlaceholder')}
                                    className="w-full bg-gray-50 border border-gray-100 p-3 rounded text-xs font-bold focus:outline-none focus:border-editorial-navy transition-colors tracking-widest"
                                  />
                                </div>
                              )}
                              
                              <button 
                                type="submit"
                                disabled={isAuthenticating}
                                className="w-full border-2 border-editorial-navy py-3 rounded-sm text-editorial-navy font-black text-[11px] uppercase tracking-widest hover:bg-editorial-navy hover:text-white transition-all active:scale-90 disabled:opacity-50 disabled:cursor-wait flex items-center justify-center gap-2"
                              >
                                {isAuthenticating && (
                                  <motion.div 
                                    animate={{ rotate: 360 }}
                                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                                    className="w-3 h-3 border-2 border-current border-t-transparent rounded-full"
                                  />
                                )}
                                {isLoginMode ? t('login') : t('register')}
                              </button>

                              <div className="text-center pt-2">
                                <button 
                                  type="button"
                                  onClick={() => setIsLoginMode(!isLoginMode)}
                                  className="text-[10px] font-bold text-editorial-navy/60 hover:text-editorial-navy underline decoration-editorial-gold decoration-2 underline-offset-4 transition-colors"
                                >
                                  {isLoginMode ? t('createNewAccount') : t('alreadyAccount')}
                                </button>
                              </div>
                            </form>
                          </div>
                      )}
                          
                          <div className="flex items-center justify-center gap-2 opacity-40">
                            <Shield size={12} />
                            <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest text-center leading-relaxed">
                              {t('securityFooter')}
                            </p>
                          </div>
                        </motion.div>
                  </div>
                )}
              </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
