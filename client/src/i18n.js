import i18n from "i18next";
import {initReactI18next} from "react-i18next";

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
            errors: {
              userNotFound: "Account does not exist",
              wrongPassword: "Password is incorrect",
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
          home: "HOME",
          alarm: "ALARM",
          setting: "SETTING",
          membership: "MEMBERSHIP",
        },
        sectionTitles: {
          new: "Recently Uploaded Videos",
          best: "Real-time Best",
          weekly: "{{uploader}}'s Videos",
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
            errors: {
              userNotFound: "존재하지 않는 계정입니다",
              wrongPassword: "비밀번호가 일치하지 않습니다",
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
          home: "홈",
          alarm: "알림",
          setting: "설정",
          membership: "멤버십",
        },
        sectionTitles: {
          new: "최근에 등록된 동영상",
          best: "실시간 베스트",
          weekly: "{{uploader}}의 동영상",
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
            errors: {
              userNotFound: "アカウントが存在しません",
              wrongPassword: "パスワードが一致しません",
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
          new: "新着",
          realTimeBest: "リアルタイムベスト",
        },
        sectionTitles: {
          new: "最近アップロードされた動画",
          best: "リアルタイムベスト",
          weekly: "{{uploader}}の動画",
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
              label: "영상 내용",
              placeholder: "영상 내용을 입력하세요",
            },
            submit: "アップロード",
          },
          messages: {
            uploadSuccess: "アップロードが完了しました！",
            uploadError: "アップロード中にエラーが発生しました。",
          },
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
            errors: {
              userNotFound: "账号不存在",
              wrongPassword: "密码不正确",
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
          new: "最新",
          realTimeBest: "实时最佳",
        },

        sectionTitles: {
          new: "最近上传的视频",
          best: "实时最佳",
          weekly: "{{uploader}}的视频",
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
            memberThumbnail: {
              label: "会员缩略图",
              uploadText: "点击上传图片",
            },
            creatorName: {
              label: "创作者名称",
              placeholder: "请输入创作者名称",
            },
            description: {
              label: "영상 내용",
              placeholder: "입력",
            },
            submit: "上传",
          },
          messages: {
            uploadSuccess: "上传完成！",
            uploadError: "上传过程中发生错误。",
          },
        },
      },
    },
  },
  lng: "ko", // 기본 언어
  fallbackLng: "en", // 폴백 언어
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
