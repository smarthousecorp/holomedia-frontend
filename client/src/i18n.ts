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
            marketing: {
              title:
                "Marketing Utilization Agreement and Advertising Receipt Agreement",
              description:
                "We provide various information related to services, such as new product news, event announcements, and customer benefits.",
              smsAgreement: "SMS Receipt Agreement (Optional)",
            },
            terms: {
              title: "Terms of Service Agreement",
              termsOfService: "Terms of Service",
              privacyPolicy: "Privacy Policy",
              ageVerification: "I confirm that I am 19 years or older.",
              and: "and",
              agree: "agree to the",
            },
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
          findAccount: {
            title: "Find Account",
            subtitle: {
              default: "Please select how to find your ID",
              verified: "Here are your verified IDs",
            },
            verification: {
              phoneTitle: "Verify with your phone number",
              phoneDescription:
                "You can find your ID by verifying with your registered phone number",
              error: "Could not find your ID",
            },
            idList: {
              title: "Registered ID List",
              empty: "No registered IDs found",
              clickToReset: "Click to find password",
            },
            backToLogin: "Back to Login Page",
          },
          verification: {
            button: "Verify with NICE",
            processing: "Processing verification...",
            complete: "Verified",
            error: "Verification failed",
          },
          findPassword: {
            title: "Find Password",
            subtitle: {
              enterId: "Please enter your ID",
              verifyIdentity: "Please verify your identity",
              enterNewPassword: "Please enter a new password",
            },
            form: {
              idPlaceholder: "Enter your ID",
              newPasswordPlaceholder:
                "New password (8-15 characters: letters, numbers, special characters)",
              confirmPasswordPlaceholder: "Confirm new password",
              next: "Next",
              changePassword: "Change Password",
            },
            verification: {
              phoneTitle: "Verify with your phone number",
              phoneDescription:
                "You can change your password by verifying with your registered phone number",
            },
            errors: {
              idVerificationFailed: "ID verification failed",
              verificationFailed: "Identity verification failed",
              passwordFormat:
                "Password must be 8-15 characters combining letters, numbers, and special characters",
              passwordMismatch: "Passwords do not match",
              changePasswordFailed: "Failed to change password",
            },
            success: "Password has been changed successfully",
            backToLogin: "Back to Login Page",
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
            vod: "VIDEO",
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
              customerService: "Customer Service: 1533-4965",
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
          profileSettings: {
            userId: "User ID",
            nickname: "Nickname",
            save: "Save Changes",
            withdrawal: "Delete Account",
            successModal: {
              title: "Success",
              content: "Profile has been updated successfully.",
              confirm: "OK",
            },
            withdrawalConfirm: {
              title: "Delete Account",
              message:
                "Are you sure you want to delete your account? This action cannot be undone.",
              confirm: "Delete",
              cancel: "Cancel",
            },
          },
          paymentSettings: {
            paymentMethods: "Payment Methods",
            billingHistory: "Billing History",
            honey: "Honey",
            addNewCard: "Add New Payment Method",
            chargeHistory: "Charge History",
            purchaseHistory: "Purchase History",
            noPurchaseHistory: "No purchase history",
            noChargeHistory: "No charge history",
            orderNumber: "Order No",
          },
          passwordSettings: {
            currentPassword: "Current Password",
            newPassword: "New Password",
            confirmPassword: "Confirm New Password",
            currentPasswordPlaceholder: "Enter current password",
            newPasswordPlaceholder: "Enter new password",
            confirmPasswordPlaceholder: "Confirm new password",
            change: "Change Password",
            errors: {
              currentPasswordMismatch: "Current password is incorrect",
              passwordMismatch: "New passwords do not match",
            },
          },
        },
        common: {
          cancel: "Cancel",
          confirm: "Confirm",
          modal: {
            buttons: {
              confirm: "OK",
              cancel: "Cancel",
              delete: "Delete",
              save: "Save",
              close: "Close",
            },
          },
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
        creators: {
          title: "Creator",
        },
        videos: {
          title: "Video Content",
        },
        payment: {
          modal: {
            title: "Charge Honey",
            sections: {
              productSelection: "Select Product",
              paymentMethod: "Payment Method",
              totalAmount: "Total Amount",
            },
            customAmount: {
              placeholder: "Enter amount (honey count)",
            },
            paymentLocation: {
              domestic: "Pay from Korea",
              foreign: "Pay from Overseas",
            },
            priceBreakdown: {
              price: "Price",
              vat: "VAT",
              total: "Total Payment Amount",
            },
            exchangeRate: "Exchange Rate",
            convertedAmount: "Converted Amount",
            currency: {
              usd: "USD",
              jpy: "JPY",
            },
            button: {
              pay: "Pay Now",
              processing: "Processing payment...",
            },
            alerts: {
              inProgress:
                "Payment is in progress. Please complete or close the payment window.",
              currencyNotSupported:
                "{{currency}} currency is not currently supported. Proceeding with USD payment.",
            },
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
            marketing: {
              title: "마케팅 활용 동의 및 광고 수신 동의",
              description:
                "서비스와 관련된 신상품 소식, 이벤트 안내, 고객 혜택 등 다양한 정보를 제공합니다.",
              smsAgreement: "SMS 수신 동의 (선택)",
            },
            terms: {
              title: "약관 동의",
              termsOfService: "이용약관",
              privacyPolicy: "개인정보처리방침",
              ageVerification: "19세 이상임을 확인합니다.",
              and: "및",
              agree: "에 동의하며, ",
            },
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
          findAccount: {
            title: "아이디 찾기",
            subtitle: {
              default: "아이디를 찾는 방법을 선택해주세요",
              verified: "확인된 아이디 목록입니다",
            },
            verification: {
              phoneTitle: "본인명의 휴대전화로 인증",
              phoneDescription:
                "본인명의로 등록된 휴대전화로 인증하여 아이디를 찾을 수 있습니다",
              error: "아이디를 찾을 수 없습니다",
            },
            idList: {
              title: "등록된 아이디 목록",
              empty: "등록된 아이디가 없습니다",
              clickToReset: "클릭하여 비밀번호 찾기",
            },
            backToLogin: "로그인 페이지로 돌아가기",
          },
          verification: {
            button: "본인인증",
            processing: "인증 처리중...",
            complete: "인증완료",
            error: "인증에 실패했습니다",
          },
          findPassword: {
            title: "비밀번호 찾기",
            subtitle: {
              enterId: "아이디를 입력해주세요",
              verifyIdentity: "본인인증을 진행해주세요",
              enterNewPassword: "새로운 비밀번호를 입력해주세요",
            },
            form: {
              idPlaceholder: "아이디를 입력하세요",
              newPasswordPlaceholder:
                "새 비밀번호 (8~15자 영문, 숫자, 특수문자 조합)",
              confirmPasswordPlaceholder: "새 비밀번호 확인",
              next: "다음",
              changePassword: "비밀번호 변경",
            },
            verification: {
              phoneTitle: "본인명의 휴대전화로 인증",
              phoneDescription:
                "본인명의로 등록된 휴대전화로 인증하여 비밀번호를 변경할 수 있습니다",
            },
            errors: {
              idVerificationFailed: "아이디 검증에 실패했습니다",
              verificationFailed: "본인인증에 실패했습니다",
              passwordFormat:
                "비밀번호는 8~15자의 영문, 숫자, 특수문자 조합이어야 합니다",
              passwordMismatch: "비밀번호가 일치하지 않습니다",
              changePasswordFailed: "비밀번호 변경에 실패했습니다",
            },
            success: "비밀번호가 성공적으로 변경되었습니다",
            backToLogin: "로그인 페이지로 돌아가기",
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
            vod: "동영상",
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
              customerService: "고객센터: 1533-4965",
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
          profileSettings: {
            userId: "아이디",
            nickname: "닉네임",
            save: "변경사항 저장",
            withdrawal: "회원탈퇴",
            successModal: {
              title: "성공",
              content: "프로필이 성공적으로 업데이트되었습니다.",
              confirm: "확인",
            },
            withdrawalConfirm: {
              title: "회원탈퇴",
              message: "정말 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다.",
              confirm: "탈퇴",
              cancel: "취소",
            },
          },
          paymentSettings: {
            paymentMethods: "결제 수단",
            billingHistory: "결제 내역",
            honey: "꿀",
            addNewCard: "새 결제 수단 추가",
            chargeHistory: "충전 내역",
            purchaseHistory: "구매 내역",
            noPurchaseHistory: "구매 내역이 없습니다",
            noChargeHistory: "충전 내역이 없습니다",
            orderNumber: "주문번호",
          },
          passwordSettings: {
            currentPassword: "현재 비밀번호",
            newPassword: "새 비밀번호",
            confirmPassword: "새 비밀번호 확인",
            currentPasswordPlaceholder: "현재 비밀번호를 입력하세요",
            newPasswordPlaceholder: "새 비밀번호를 입력하세요",
            confirmPasswordPlaceholder: "새 비밀번호를 다시 입력하세요",
            change: "비밀번호 변경",
            errors: {
              currentPasswordMismatch: "현재 비밀번호가 일치하지 않습니다",
              passwordMismatch: "새 비밀번호가 일치하지 않습니다",
            },
          },
        },
        common: {
          cancel: "취소",
          confirm: "확인",
          modal: {
            buttons: {
              confirm: "확인",
              cancel: "취소",
              delete: "삭제",
              save: "저장",
              close: "닫기",
            },
          },
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
        creators: {
          title: "크리에이터",
        },
        videos: {
          title: "동영상",
        },
        payment: {
          modal: {
            title: "꿀 충전",
            sections: {
              productSelection: "상품 선택",
              paymentMethod: "결제 수단",
              totalAmount: "전체 금액",
            },
            customAmount: {
              placeholder: "직접 입력 (꿀 개수)",
            },
            paymentLocation: {
              domestic: "한국에서 결제",
              foreign: "해외에서 결제",
            },
            priceBreakdown: {
              price: "가격",
              vat: "부가세",
              total: "최종 결제 금액",
            },
            exchangeRate: "환율",
            convertedAmount: "변환 금액",
            currency: {
              usd: "USD",
              jpy: "JPY",
            },
            button: {
              pay: "결제하기",
              processing: "결제 진행 중...",
            },
            alerts: {
              inProgress:
                "결제가 진행 중입니다. 결제창을 닫거나 완료 후 이용해주세요.",
              currencyNotSupported:
                "현재 {{currency}} 통화는 지원되지 않습니다. USD로 결제를 진행합니다.",
            },
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
            marketing: {
              title: "マーケティング利用同意及び広告受信同意",
              description:
                "サービスに関連する新製品情報、イベント案内、顧客特典など様々な情報を提供します。",
              smsAgreement: "SMS受信同意（任意）",
            },
            terms: {
              title: "利用規約に同意する",
              termsOfService: "利用規約",
              privacyPolicy: "プライバシーポリシー",
              ageVerification: "19歳以上であることを確認します。",
              and: "そして",
              agree: "に同意する",
            },
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
          findAccount: {
            title: "アカウント検索",
            subtitle: {
              default: "IDを探す方法を選択してください",
              verified: "確認されたIDリストです",
            },
            verification: {
              phoneTitle: "携帯電話番号で認証",
              phoneDescription:
                "登録された携帯電話番号で認証してIDを探すことができます",
              error: "IDが見つかりません",
            },
            idList: {
              title: "登録済みIDリスト",
              empty: "登録されたIDがありません",
              clickToReset: "クリックしてパスワードを探す",
            },
            backToLogin: "ログインページに戻る",
          },
          verification: {
            button: "本人認証",
            processing: "認証処理中...",
            complete: "認証完了",
            error: "認証に失敗しました",
          },
          findPassword: {
            title: "パスワード検索",
            subtitle: {
              enterId: "IDを入力してください",
              verifyIdentity: "本人認証を行ってください",
              enterNewPassword: "新しいパスワードを入力してください",
            },
            form: {
              idPlaceholder: "IDを入力",
              newPasswordPlaceholder:
                "新しいパスワード（8～15文字の英数字、特殊文字の組み合わせ）",
              confirmPasswordPlaceholder: "新しいパスワードを確認",
              next: "次へ",
              changePassword: "パスワード変更",
            },
            verification: {
              phoneTitle: "携帯電話番号で認証",
              phoneDescription:
                "登録された携帯電話番号で認証してパスワードを変更できます",
            },
            errors: {
              idVerificationFailed: "ID検証に失敗しました",
              verificationFailed: "本人認証に失敗しました",
              passwordFormat:
                "パスワードは8～15文字の英数字と特殊文字の組み合わせが必要です",
              passwordMismatch: "パスワードが一致しません",
              changePasswordFailed: "パスワードの変更に失敗しました",
            },
            success: "パスワードが正常に変更されました",
            backToLogin: "ログインページに戻る",
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
            vod: "動画",
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
              customerService: "カスタマーサービス：1533-4965",
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
          profileSettings: {
            userId: "ユーザーID",
            nickname: "ニックネーム",
            save: "変更を保存",
            withdrawal: "退会",
            successModal: {
              title: "成功",
              content: "プロフィールが正常に更新されました。",
              confirm: "確認",
            },
            withdrawalConfirm: {
              title: "退会",
              message:
                "本当に退会しますか？この操作は取り消すことができません。",
              confirm: "退会",
              cancel: "キャンセル",
            },
          },
          paymentSettings: {
            paymentMethods: "決済方法",
            billingHistory: "決済履歴",
            honey: "ハニー",
            addNewCard: "新しい決済方法を追加",
            chargeHistory: "チャージ履歴",
            purchaseHistory: "購入履歴",
            noPurchaseHistory: "購入履歴がありません",
            noChargeHistory: "チャージ履歴がありません",
            orderNumber: "注文番号",
          },
          passwordSettings: {
            currentPassword: "現在のパスワード",
            newPassword: "新しいパスワード",
            confirmPassword: "新しいパスワード（確認）",
            currentPasswordPlaceholder: "現在のパスワードを入力",
            newPasswordPlaceholder: "新しいパスワードを入力",
            confirmPasswordPlaceholder: "新しいパスワードを再入力",
            change: "パスワードを変更",
            errors: {
              currentPasswordMismatch: "現在のパスワードが一致しません",
              passwordMismatch: "新しいパスワードが一致しません",
            },
          },
        },
        common: {
          cancel: "キャンセル",
          confirm: "確認",
          modal: {
            buttons: {
              confirm: "確認",
              cancel: "キャンセル",
              delete: "削除",
              save: "保存",
              close: "閉じる",
            },
          },
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
        creators: {
          title: "クリエイター",
        },
        videos: {
          title: "動画",
        },
        payment: {
          modal: {
            title: "ハニーチャージ",
            sections: {
              productSelection: "商品選択",
              paymentMethod: "お支払い方法",
              totalAmount: "合計金額",
            },
            customAmount: {
              placeholder: "直接入力（ハニー数）",
            },
            paymentLocation: {
              domestic: "韓国から支払い",
              foreign: "海外から支払い",
            },
            priceBreakdown: {
              price: "価格",
              vat: "消費税",
              total: "最終支払金額",
            },
            exchangeRate: "為替レート",
            convertedAmount: "換算金額",
            currency: {
              usd: "USD",
              jpy: "JPY",
            },
            button: {
              pay: "支払う",
              processing: "決済処理中...",
            },
            alerts: {
              inProgress:
                "決済が進行中です。決済ウィンドウを閉じるか完了してからご利用ください。",
              currencyNotSupported:
                "現在 {{currency}} 通貨はサポートされていません。USDで決済を進めます。",
            },
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
            marketing: {
              title: "营销利用同意及广告接收同意",
              description:
                "我们提供与服务相关的新产品信息、活动通知、客户优惠等多样信息。",
              smsAgreement: "SMS接收同意（可选）",
            },
            terms: {
              title: "使用条款",
              termsOfService: "服务条款",
              privacyPolicy: "隐私政策",
              ageVerification: "我确认我已满19岁。",
              and: "并",
              agree: "同意",
            },
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
          findAccount: {
            title: "查找账号",
            subtitle: {
              default: "请选择查找ID的方式",
              verified: "以下是已验证的ID列表",
            },
            verification: {
              phoneTitle: "通过手机号码验证",
              phoneDescription: "您可以通过验证已注册的手机号码来查找ID",
              error: "找不到ID",
            },
            idList: {
              title: "已注册的ID列表",
              empty: "没有已注册的ID",
              clickToReset: "点击找回密码",
            },
            backToLogin: "返回登录页面",
          },
          verification: {
            button: "身份认证",
            processing: "验证处理中...",
            complete: "验证完成",
            error: "验证失败",
          },
          findPassword: {
            title: "找回密码",
            subtitle: {
              enterId: "请输入账号",
              verifyIdentity: "请进行身份验证",
              enterNewPassword: "请输入新密码",
            },
            form: {
              idPlaceholder: "请输入账号",
              newPasswordPlaceholder:
                "新密码（8-15位字母、数字、特殊字符组合）",
              confirmPasswordPlaceholder: "确认新密码",
              next: "下一步",
              changePassword: "修改密码",
            },
            verification: {
              phoneTitle: "通过手机号码验证",
              phoneDescription: "您可以通过验证已注册的手机号码来修改密码",
            },
            errors: {
              idVerificationFailed: "账号验证失败",
              verificationFailed: "身份验证失败",
              passwordFormat: "密码必须为8-15位字母、数字和特殊字符的组合",
              passwordMismatch: "两次输入的密码不一致",
              changePasswordFailed: "密码修改失败",
            },
            success: "密码修改成功",
            backToLogin: "返回登录页面",
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
            vod: "视频",
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
              customerService: "客服中心：1533-4965",
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
          profileSettings: {
            userId: "用户ID",
            nickname: "昵称",
            save: "保存更改",
            withdrawal: "注销账号",
            successModal: {
              title: "成功",
              content: "个人资料已成功更新。",
              confirm: "确定",
            },
            withdrawalConfirm: {
              title: "注销账号",
              message: "确定要注销账号吗？此操作无法撤销。",
              confirm: "注销",
              cancel: "取消",
            },
          },
          paymentSettings: {
            paymentMethods: "支付方式",
            billingHistory: "支付记录",
            honey: "蜂蜜",
            addNewCard: "添加新支付方式",
            chargeHistory: "充值记录",
            purchaseHistory: "购买记录",
            noPurchaseHistory: "暂无购买记录",
            noChargeHistory: "暂无充值记录",
            orderNumber: "订单号",
          },
          passwordSettings: {
            currentPassword: "当前密码",
            newPassword: "新密码",
            confirmPassword: "确认新密码",
            currentPasswordPlaceholder: "请输入当前密码",
            newPasswordPlaceholder: "请输入新密码",
            confirmPasswordPlaceholder: "请再次输入新密码",
            change: "修改密码",
            errors: {
              currentPasswordMismatch: "当前密码不正确",
              passwordMismatch: "两次输入的新密码不一致",
            },
          },
        },
        common: {
          cancel: "取消",
          confirm: "确认",
          modal: {
            buttons: {
              confirm: "确认",
              cancel: "取消",
              delete: "删除",
              save: "保存",
              close: "关闭",
            },
          },
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
        creators: {
          title: "创作者",
        },
        videos: {
          title: "视频",
        },
        payment: {
          modal: {
            title: "蜂蜜充值",
            sections: {
              productSelection: "选择商品",
              paymentMethod: "支付方式",
              totalAmount: "总金额",
            },
            customAmount: {
              placeholder: "直接输入（蜂蜜数量）",
            },
            paymentLocation: {
              domestic: "在韩国支付",
              foreign: "在海外支付",
            },
            priceBreakdown: {
              price: "价格",
              vat: "增值税",
              total: "最终支付金额",
            },
            exchangeRate: "汇率",
            convertedAmount: "转换金额",
            currency: {
              usd: "USD",
              jpy: "JPY",
            },
            button: {
              pay: "立即支付",
              processing: "支付处理中...",
            },
            alerts: {
              inProgress: "支付正在进行中。请完成或关闭支付窗口后再使用。",
              currencyNotSupported:
                "当前 {{currency}} 货币不支持。将使用 USD 支付。",
            },
          },
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

    // IP 정보 로깅 추가
    console.log("=== IP 기반 국가 감지 정보 ===");
    console.log("국가:", response.data.country_name);
    console.log("국가 코드:", response.data.country_code);
    console.log("도시:", response.data.city);
    console.log("지역:", response.data.region);
    console.log("IP:", response.data.ip);
    console.log("========================");

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
