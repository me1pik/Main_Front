// 네이티브 앱 타입 선언
declare global {
  interface Window {
    nativeApp?: {
      requestLogin?: () => void;
      saveLoginInfo?: (data: Record<string, unknown>) => void;
    };
    ReactNativeWebView?: {
      postMessage: (message: string) => void;
    };
    webkit?: {
      messageHandlers?: {
        loginHandler?: {
          postMessage: (message: Record<string, unknown>) => void;
        };
      };
    };
  }
}

/**
 * 네이티브 앱 환경인지 확인
 */
export const isNativeApp = (): boolean => {
  return (
    typeof window !== 'undefined' &&
    (window.nativeApp !== undefined ||
      window.ReactNativeWebView !== undefined ||
      window.webkit?.messageHandlers !== undefined)
  );
};

/**
 * 네이티브 앱에 로그인 요청 전송
 */
export const requestNativeLogin = (): void => {
  if (typeof window !== 'undefined' && window.nativeApp?.requestLogin) {
    window.nativeApp.requestLogin();
  } else if (typeof window !== 'undefined' && window.ReactNativeWebView) {
    window.ReactNativeWebView.postMessage(
      JSON.stringify({
        type: 'REQUEST_LOGIN',
      })
    );
  } else if (
    typeof window !== 'undefined' &&
    window.webkit?.messageHandlers?.loginHandler
  ) {
    window.webkit.messageHandlers.loginHandler.postMessage({
      type: 'REQUEST_LOGIN',
    });
  }
};

/**
 * 네이티브 앱에 로그인 정보 저장 요청
 */
export const saveNativeLoginInfo = (
  loginData: Record<string, unknown>
): void => {
  if (typeof window !== 'undefined' && window.nativeApp?.saveLoginInfo) {
    window.nativeApp.saveLoginInfo(loginData);
  } else if (typeof window !== 'undefined' && window.ReactNativeWebView) {
    window.ReactNativeWebView.postMessage(
      JSON.stringify({
        type: 'SAVE_LOGIN_INFO',
        data: loginData,
      })
    );
  } else if (
    typeof window !== 'undefined' &&
    window.webkit?.messageHandlers?.loginHandler
  ) {
    window.webkit.messageHandlers.loginHandler.postMessage({
      type: 'SAVE_LOGIN_INFO',
      data: loginData,
    });
  }
};

/**
 * 토큰이 있는지 확인
 */
export const hasValidToken = (): boolean => {
  const token =
    localStorage.getItem('accessToken') ||
    (typeof document !== 'undefined' &&
      document.cookie.includes('accessToken'));
  return !!token;
};

/**
 * 인증이 필요한 페이지인지 확인
 */
export const isProtectedRoute = (pathname: string): boolean => {
  const publicPaths = [
    '/signup',
    '/findId',
    '/findid',
    '/findPassword',
    '/landing',
    '/',
    '/login',
    '/PersonalLink',
  ];
  return !publicPaths.includes(pathname);
};

/**
 * 네이티브 앱에서 웹뷰로 로그인 정보를 전달하는 방법
 *
 * Android (React Native) 예시:
 * ```javascript
 * // 로그인 성공 후 웹뷰에 이벤트 전달
 * webViewRef.current.postMessage(JSON.stringify({
 *   type: 'loginInfoReceived',
 *   detail: {
 *     isLoggedIn: true,
 *     userInfo: {
 *       token: 'access_token_here',
 *       refreshToken: 'refresh_token_here',
 *       email: 'user@example.com'
 *     }
 *   }
 * }));
 * ```
 *
 * iOS (Swift) 예시:
 * ```swift
 * // 로그인 성공 후 웹뷰에 이벤트 전달
 * let loginInfo = [
 *   "type": "loginInfoReceived",
 *   "detail": [
 *     "isLoggedIn": true,
 *     "userInfo": [
 *       "token": "access_token_here",
 *       "refreshToken": "refresh_token_here",
 *       "email": "user@example.com"
 *     ]
 *   ]
 * ] as [String : Any]
 *
 * webView.evaluateJavaScript("""
 *   window.dispatchEvent(new CustomEvent('loginInfoReceived', {
 *     detail: \(loginInfo)
 *   }));
 * """)
 * ```
 */
