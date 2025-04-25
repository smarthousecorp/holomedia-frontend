import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import axios from "axios";

const detectUserLanguage = (): string => {
  try {
    const browserLang = navigator.language.split("-")[0].toLowerCase();
    return ["ko", "jp", "zh", "en"].includes(browserLang) ? browserLang : "ko";
  } catch (error) {
    console.error("Language detection failed:", error);
    return "ko";
  }
};

// 초기 언어 설정
const defaultLanguage = detectUserLanguage();

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: {
        auth: {
          social: {
            loginTitle: "SNS Easy Login",
            signupTitle: "SNS Easy Sign Up",
            naverAlt: "Naver Icon",
            googleAlt: "Google Icon",
            kakaoAlt: "Kakao Icon",
          },
          modal: {
            title: {
              login: "Login",
              signup: "Sign Up",
            },
            close: "Close",
          },
          login: {
            id: "ID",
            password: "Password",
            idPlaceholder: "Enter your ID",
            passwordPlaceholder: "Enter your password",
            button: "Login",
            rememberID: "Remember ID",
            autoLogin: "Auto Login",
            findAccount: "Find Account",
            findPassword: "Find Password",
            errors: {
              userNotFound: "Account does not exist",
              retypeFields: "Please enter your ID or password again",
              requiredFields: "Please enter ID and password",
            },
          },
          signup: {
            id: "ID",
            password: "Password",
            passwordCheck: "Confirm Password",
            username: "Nickname",
            idPlaceholder: "6-15 characters (English lowercase, numbers)",
            passwordPlaceholder:
              "8-15 characters (English upper/lowercase, numbers, special characters !@#$%^&*)",
            passwordCheckPlaceholder: "Confirm your password",
            usernamePlaceholder: "2-12 characters (Korean, English, numbers)",
            button: "Sign Up",
            alreadyMember: "Already a member?",
            goToLogin: "page",
            errors: {
              idFormat:
                "Must be 6-15 characters including English lowercase and numbers",
              passwordFormat:
                "Must be 8-15 characters combining English upper/lowercase, numbers, and special characters",
              passwordMismatch: "Passwords do not match",
              usernameFormat:
                "Must be 2-12 characters in Korean, English, or numbers",
              duplicateId: "ID already exists",
              duplicateUsername: "Nickname already exists",
            },
            success: "Sign up completed!",
          },
        },
        header: {
          search: {
            placeholder: "Enter search term",
          },
          auth: {
            loginSignup: "Login / Sign Up",
            profile: "{{username}}'s Profile",
            settings: "Settings",
            upload: "Upload",
            logout: "Logout",
          },
          toast: {
            logoutSuccess: "Logout completed.",
          },
        },
        sidebar: {
          logo: {
            alt: "Logo",
          },
          profile: {
            picture: "Profile Picture",
            bloom: {
              icon: "Bloom icon",
              charge: "Charge",
            },
            select: "Select",
          },
          nav: {
            home: "HOME",
            creator: "CREATOR",
            vod: "VOD",
            setting: "SETTING",
            membership: "MEMBERSHIP",
          },
          footer: {
            terms: "HOLOMEDIA Terms of Service",
            privacy: "Privacy Policy",
            youth: "Youth Protection Policy",
            business: "Business Terms of Service",
            info: {
              company: "HOLOMEDIA Co., Ltd.    CEO: Yuntae Cha",
              registration: "Business Registration Number: 256-81-03803",
              address:
                "Room 3012-40, Building A, 323, Incheontawerdae-ro, Yeonsu-gu, Incheon, Republic of Korea",
              copyright: "©HOLOMEDIA All Rights Reserved.",
            },
          },
        },
        main: {
          home: "Home",
          search: {
            placeholder: "Find Idol",
          },
          loading: {
            error: "Failed to load data.",
            retry: "Retry",
          },
          errors: {
            loginRequired: "Please login to access",
            loadFailed: "Failed to load data.",
          },
          noVideos: "No videos registered in home",
          adBanner: "Advertisement Banner",
        },
        upload: {
          pageTitle: "Upload New Video",
          form: {
            videoTitle: {
              label: "Title",
              placeholder: "Enter video title",
            },
            videoFile: {
              label: "Video File",
              uploadText: "Click to upload video",
            },
            thumbnail: {
              label: "Thumbnail",
              uploadText: "Click to upload image",
            },
            creatorName: {
              label: "Creator Name",
              placeholder: "Enter creator name",
            },
            description: {
              label: "Description",
              placeholder: "Enter description",
            },
            submit: "Upload",
          },
          messages: {
            uploadSuccess: "Upload completed!",
            uploadError: "An error occurred during upload.",
          },
        },
        settings: {
          title: "Settings",
          profile: "Profile Settings",
          account: "Account Settings",
          payment: "Payment Management",
          password: "Change Password",
          logout: "Logout",
          logoutModal: {
            title: "Logout",
            message: "Are you sure you want to logout?",
          },
        },
        common: {
          cancel: "Cancel",
        },
        prepare: {
          message: "We are preparing the",
          feature: "feature",
          comingSoon: "We'll be back with an exciting update soon 🚀",
        },
        notification: {
          noNew: "No new notifications",
        },
        error: {
          404: {
            message:
              "Page not found.\nThe address you entered does not exist or\nthe requested page has been changed or deleted.",
            button: "Go to Main Page",
          },
          unknown: {
            message:
              "An unexpected error has occurred.\nIt may be a temporary server issue or network problem.\nPlease try again later.",
            button: "Try Again",
          },
        },
        loading: {
          message: "Loading...",
        },
      },
    },
    ko: {
      translation: {
        auth: {
          social: {
            loginTitle: "SNS 간편 로그인",
            signupTitle: "SNS 간편 회원가입",
            naverAlt: "네이버 아이콘",
            googleAlt: "구글 아이콘",
            kakaoAlt: "카카오 아이콘",
          },
          modal: {
            title: {
              login: "로그인",
              signup: "회원가입",
            },
            close: "닫기",
          },
          login: {
            id: "아이디",
            password: "비밀번호",
            idPlaceholder: "아이디를 입력하세요",
            passwordPlaceholder: "비밀번호를 입력하세요",
            button: "로그인",
            rememberID: "아이디 저장",
            autoLogin: "자동 로그인",
            findAccount: "계정 찾기",
            findPassword: "비밀번호 찾기",
            errors: {
              retypeFields: "아이디 또는 비밀번호를 다시 입력해주세요",
              userNotFound: "존재하지 않는 계정입니다",
              requiredFields: "아이디와 비밀번호를 입력하세요",
            },
          },
          signup: {
            id: "아이디",
            password: "비밀번호",
            passwordCheck: "비밀번호 확인",
            username: "닉네임",
            idPlaceholder: "6~15자의 영문, 소문자, 숫자",
            passwordPlaceholder:
              "8~15자의 영문 대소문자, 숫자, 특수문자 (!@#$%^&*)",
            passwordCheckPlaceholder: "비밀번호 확인",
            usernamePlaceholder: "2~12자 한글, 영문, 숫자",
            button: "회원가입",
            alreadyMember: "이미 회원이신가요?",
            goToLogin: "",
            errors: {
              idFormat: "6~15자의 영문 소문자 및 숫자가 포함되어야 합니다",
              passwordFormat:
                "8~15자, 영문 대소문자+숫자+특수문자 조합으로 구성되어야 합니다",
              passwordMismatch: "비밀번호가 일치하지 않습니다",
              usernameFormat: "2~12자의 한글, 영문, 숫자로 구성되어야 합니다",
              duplicateId: "이미 존재하는 아이디입니다",
              duplicateUsername: "이미 존재하는 닉네임입니다",
            },
            success: "회원가입이 완료되었습니다!",
          },
        },
        header: {
          search: {
            placeholder: "검색어를 입력해주세요",
          },
          auth: {
            loginSignup: "로그인 / 회원가입",
            profile: "{{username}} 님",
            settings: "설정",
            upload: "업로드",
            logout: "로그아웃",
          },
          toast: {
            logoutSuccess: "로그아웃이 완료되었습니다.",
          },
        },
        sidebar: {
          logo: {
            alt: "로고",
          },
          profile: {
            picture: "프로필 사진",
            bloom: {
              icon: "bloom 아이콘",
              charge: "충전하기",
            },
            select: "선택하기",
          },
          nav: {
            home: "홈",
            creator: "크리에이터",
            vod: "vod",
            setting: "설정",
            membership: "멤버십",
          },
          footer: {
            terms: "홀로미디어 이용약관",
            privacy: "개인정보처리방침",
            youth: "청소년 보호정책",
            business: "사업자 이용약관",
            info: {
              company: "홀로미디어(주)    대표이사: 차윤태",
              registration: "사업자등록번호: 256-81-03803",
              address: "인천광역시 연수구 인천타워대로 323, 에이동 3012-40호",
              copyright: "©HOLOMEDIA All Rights Reserved.",
            },
          },
        },
        main: {
          home: "홈",
          search: {
            placeholder: "아이돌 찾기",
          },
          loading: {
            error: "데이터 로딩에 실패했습니다.",
            retry: "다시 시도",
          },
          errors: {
            loginRequired: "로그인 후에 접근 가능합니다.",
            loadFailed: "데이터를 불러오는데 실패했습니다.",
          },
          noVideos: "홈에 등록된 영상이 없습니다",
          adBanner: "광고 배너",
        },
        upload: {
          pageTitle: "새 영상 업로드",
          form: {
            videoTitle: {
              label: "제목",
              placeholder: "영상 제목을 입력하세요",
            },
            videoFile: {
              label: "영상 파일",
              uploadText: "클릭하여 영상 업로드",
            },
            Thumbnail: {
              label: "썸네일",
              uploadText: "클릭하여 이미지 업로드",
            },
            creatorName: {
              label: "크리에이터 이름",
              placeholder: "크리에이터 이름을 입력하세요",
            },
            description: {
              label: "영상 내용",
              placeholder: "영상 설명을 입력하세요",
            },
            submit: "업로드",
          },
          messages: {
            uploadSuccess: "업로드가 완료되었습니다!",
            uploadError: "업로드 중 오류가 발생했습니다.",
          },
        },
        settings: {
          title: "설정",
          profile: "프로필 설정",
          account: "계정 설정",
          payment: "결제 관리",
          password: "비밀번호 변경",
          logout: "로그아웃",
          logoutModal: {
            title: "로그아웃",
            message: "정말 로그아웃 하시겠습니까?",
          },
        },
        common: {
          cancel: "취소",
        },
        prepare: {
          message: "기능을",
          feature: "준비하고 있습니다",
          comingSoon: "곧 멋진 업데이트로 찾아오겠습니다 🚀",
        },
        notification: {
          noNew: "새로운 알림이 없습니다",
        },
        error: {
          404: {
            message:
              "페이지를 찾을 수 없습니다.\n존재하지 않는 주소를 입력하셨거나\n요청하신 페이지의 주소가 변경, 삭제되어 찾을 수 없습니다.",
            button: "메인 페이지로 이동",
          },
          unknown: {
            message:
              "예상하지 못한 오류가 발생했습니다.\n서버의 일시적인 장애이거나 네트워크 문제일 수 있습니다.\n잠시 후에 다시 시도해 주세요.",
            button: "다시 시도",
          },
        },
        loading: {
          message: "로딩중입니다...",
        },
      },
    },
    jp: {
      translation: {
        auth: {
          social: {
            loginTitle: "SNSで簡単ログイン",
            signupTitle: "SNSで簡単会員登録",
            naverAlt: "NAVERアイコン",
            googleAlt: "Googleアイコン",
            kakaoAlt: "KAKAOアイコン",
          },
          modal: {
            title: {
              login: "ログイン",
              signup: "新規登録",
            },
            close: "閉じる",
          },
          login: {
            id: "ID",
            password: "パスワード",
            idPlaceholder: "IDを入力してください",
            passwordPlaceholder: "パスワードを入力してください",
            button: "ログイン",
            rememberID: "IDを保存",
            autoLogin: "自動ログイン",
            findAccount: "アカウント検索",
            findPassword: "パスワード検索",
            errors: {
              retypeFields: " IDまたはパスワードを再入力してください",
              userNotFound: "アカウントが存在しません",
              requiredFields: "IDとパスワードを入力してください",
            },
          },
          signup: {
            id: "ID",
            password: "パスワード",
            passwordCheck: "パスワード確認",
            username: "ニックネーム",
            idPlaceholder: "6~15文字の英字小文字、数字",
            passwordPlaceholder:
              "8~15文字の英大文字小文字、数字、特殊文字(!@#$%^&*)",
            passwordCheckPlaceholder: "パスワードを再入力",
            usernamePlaceholder: "2~12文字の日本語、英字、数字",
            button: "登録",
            alreadyMember: "すでに会員ですか？",
            goToLogin: "ページへ",
            errors: {
              idFormat: "6~15文字の英字小文字と数字を含める必要があります",
              passwordFormat:
                "8~15文字の英大文字小文字、数字、特殊文字の組み合わせが必要です",
              passwordMismatch: "パスワードが一致しません",
              usernameFormat:
                "2~12文字の日本語、英字、数字で構成する必要があります",
              duplicateId: "既に存在するIDです",
              duplicateUsername: "既に存在するニックネームです",
            },
            success: "会員登録が完了しました！",
          },
        },
        header: {
          search: {
            placeholder: "検索キーワードを入力してください",
          },
          auth: {
            loginSignup: "ログイン / 新規登録",
            profile: "{{username}}様",
            settings: "設定",
            upload: "アップロード",
            logout: "ログアウト",
          },
          toast: {
            logoutSuccess: "ログアウトが完了しました。",
          },
        },
        sidebar: {
          logo: {
            alt: "ロゴ",
          },
          profile: {
            picture: "プロフィール写真",
            bloom: {
              icon: "ブルームアイコン",
              charge: "チャージ",
            },
            select: "選択する",
          },
          nav: {
            home: "ホーム",
            creator: "クリエイター",
            vod: "vod",
            setting: "設定",
            membership: "メンバーシップ",
          },
          footer: {
            terms: "HOLOMEDIA利用規約",
            privacy: "プライバシーポリシー",
            youth: "青少年保護方針",
            business: "事業者利用規約",
            info: {
              company: "HOLOMEDIA株式会社    代表取締役：チャ・ユンテ",
              registration: "事業者登録番号：256-81-03803",
              address: "仁川広域市延寿区仁川タワー大路323、A棟3012-40号",
              copyright: "©HOLOMEDIA All Rights Reserved.",
            },
          },
        },
        main: {
          home: "ホーム",
          search: {
            placeholder: "アイドル検索",
          },
          loading: {
            error: "データの読み込みに失敗しました。",
            retry: "再試行",
          },
          errors: {
            loginRequired: "ログインが必要です",
            loadFailed: "データの読み込みに失敗しました。",
          },
          noVideos: "ホームに登録された動画はありません",
          adBanner: "広告バナー",
        },
        upload: {
          pageTitle: "新規動画アップロード",
          form: {
            videoTitle: {
              label: "タイトル",
              placeholder: "動画タイトルを入力してください",
            },
            videoFile: {
              label: "動画ファイル",
              uploadText: "クリックして動画をアップロード",
            },
            Thumbnail: {
              label: "サムネイル",
              uploadText: "クリックして画像をアップロード",
            },
            creatorName: {
              label: "クリエイター名",
              placeholder: "クリエイター名を入力してください",
            },
            description: {
              label: "動画の説明",
              placeholder: "動画の説明を入力してください",
            },
            submit: "アップロード",
          },
          messages: {
            uploadSuccess: "アップロードが完了しました！",
            uploadError: "アップロード中にエラーが発生しました。",
          },
        },
        settings: {
          title: "設定",
          profile: "プロフィール設定",
          account: "アカウント設定",
          payment: "決済管理",
          password: "パスワード変更",
          logout: "ログアウト",
          logoutModal: {
            title: "ログアウト",
            message: "本当にログアウトしますか？",
          },
        },
        common: {
          cancel: "キャンセル",
        },
        prepare: {
          message: "機能を",
          feature: "準備しています",
          comingSoon: "まもなく素敵なアップデートでお会いしましょう 🚀",
        },
        notification: {
          noNew: "新しい通知はありません",
        },
        error: {
          404: {
            message:
              "ページが見つかりません。\n存在しないアドレスを入力されたか、\nページのアドレスが変更・削除されて見つかりません。",
            button: "メインページへ",
          },
          unknown: {
            message:
              "予期せぬエラーが発生しました。\nサーバーの一時的な障害またはネットワークの問題の可能性があります。\n後ほど再度お試しください。",
            button: "再試行",
          },
        },
        loading: {
          message: "読み込み中...",
        },
      },
    },
    zh: {
      translation: {
        auth: {
          social: {
            loginTitle: "SNS快捷登录",
            signupTitle: "SNS快捷注册",
            naverAlt: "NAVER图标",
            googleAlt: "Google图标",
            kakaoAlt: "Kakao图标",
          },
          modal: {
            title: {
              login: "登录",
              signup: "注册",
            },
            close: "关闭",
          },
          login: {
            id: "账号",
            password: "密码",
            idPlaceholder: "请输入账号",
            passwordPlaceholder: "请输入密码",
            button: "登录",
            rememberID: "记住账号",
            autoLogin: "自动登录",
            findAccount: "查找账号",
            findPassword: "找回密码",
            errors: {
              retypeFields: "请重新输入您的ID或密码",
              userNotFound: "账号不存在",
              requiredFields: "请输入账号和密码",
            },
          },
          signup: {
            id: "账号",
            password: "密码",
            passwordCheck: "确认密码",
            username: "昵称",
            idPlaceholder: "6-15位英文小写字母、数字",
            passwordPlaceholder:
              "8-15位英文大小写字母、数字、特殊符号(!@#$%^&*)",
            passwordCheckPlaceholder: "请确认密码",
            usernamePlaceholder: "2-12位中文、英文、数字",
            button: "注册",
            alreadyMember: "已经是会员了吗？",
            goToLogin: "页面",
            errors: {
              idFormat: "必须包含6-15位英文小写字母和数字",
              passwordFormat: "必须包含8-15位英文大小写字母、数字和特殊符号",
              passwordMismatch: "两次输入的密码不一致",
              usernameFormat: "必须包含2-12位中文、英文或数字",
              duplicateId: "该账号已存在",
              duplicateUsername: "该昵称已存在",
            },
            success: "注册成功！",
          },
        },
        header: {
          search: {
            placeholder: "请输入搜索关键词",
          },
          auth: {
            loginSignup: "登录 / 注册",
            profile: "{{username}}",
            settings: "设置",
            upload: "上传",
            logout: "退出登录",
          },
          toast: {
            logoutSuccess: "已成功退出登录。",
          },
        },
        sidebar: {
          logo: {
            alt: "标志",
          },
          profile: {
            picture: "个人头像",
            bloom: {
              icon: "Bloom图标",
              charge: "充值",
            },
            select: "选择",
          },
          nav: {
            home: "首页",
            creator: "创作者",
            vod: "vod",
            setting: "设置",
            membership: "会员",
          },
          footer: {
            terms: "HOLOMEDIA使用条款",
            privacy: "隐私政策",
            youth: "青少年保护政策",
            business: "商家使用条款",
            info: {
              company: "HOLOMEDIA有限公司    董事长：车允泰",
              registration: "营业执照号：256-81-03803",
              address: "仁川广域市延寿区仁川塔大路323号A栋3012-40室",
              copyright: "©HOLOMEDIA All Rights Reserved.",
            },
          },
        },
        main: {
          home: "首页",
          search: {
            placeholder: "搜索偶像",
          },
          loading: {
            error: "数据加载失败。",
            retry: "重试",
          },
          errors: {
            loginRequired: "请登录后访问",
            loadFailed: "数据加载失败。",
          },
          noVideos: "首页暂无视频",
          adBanner: "广告横幅",
        },
        upload: {
          pageTitle: "上传新视频",
          form: {
            videoTitle: {
              label: "标题",
              placeholder: "请输入视频标题",
            },
            videoFile: {
              label: "视频文件",
              uploadText: "点击上传视频",
            },
            Thumbnail: {
              label: "缩略图",
              uploadText: "点击上传图片",
            },
            creatorName: {
              label: "创作者名称",
              placeholder: "请输入创作者名称",
            },
            description: {
              label: "视频说明",
              placeholder: "请输入视频说明",
            },
            submit: "上传",
          },
          messages: {
            uploadSuccess: "上传完成！",
            uploadError: "上传过程中发生错误。",
          },
        },
        settings: {
          title: "设置",
          profile: "个人资料设置",
          account: "账号设置",
          payment: "支付管理",
          password: "修改密码",
          logout: "退出登录",
          logoutModal: {
            title: "退出登录",
            message: "确定要退出登录吗？",
          },
        },
        common: {
          cancel: "取消",
        },
        prepare: {
          message: "功能",
          feature: "正在准备中",
          comingSoon: "即将带来精彩更新 🚀",
        },
        notification: {
          noNew: "暂无新通知",
        },
        error: {
          404: {
            message:
              "找不到页面。\n您输入的地址不存在，或者\n请求的页面地址已更改或删除。",
            button: "转到主页",
          },
          unknown: {
            message:
              "发生意外错误。\n可能是服务器暂时故障或网络问题。\n请稍后重试。",
            button: "重试",
          },
        },
        loading: {
          message: "加载中...",
        },
      },
    },
  },
  lng: defaultLanguage,
  fallbackLng: "ko",
  interpolation: {
    escapeValue: false,
  },
  react: {
    useSuspense: false,
  },
});

// IP 기반 언어 감지는 앱이 로드된 후에 비동기적으로 수행
const updateLanguageBasedOnIP = async () => {
  try {
    const response = await axios.get("https://ipapi.co/json/");
    const countryCode = response.data.country_code.toLowerCase();

    const languageMap: Record<string, string> = {
      jp: "jp",
      kr: "ko",
      cn: "zh",
      tw: "zh",
      hk: "zh",
      sg: "zh",
    };

    const detectedLanguage = languageMap[countryCode] || defaultLanguage;
    if (detectedLanguage !== i18n.language) {
      await i18n.changeLanguage(detectedLanguage);
    }
  } catch (error) {
    console.error("IP-based language detection failed:", error);
  }
};

// 앱이 로드된 후 IP 기반 언어 감지 실행
setTimeout(updateLanguageBasedOnIP, 0);

export default i18n;
