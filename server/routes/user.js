const express = require("express");
const session = require("express-session");
const authenticateToken = require("../module/authJWT");
const router = express.Router();
const NiceAuth = require("../module/NiceAuth");

const db = require("../db/holomedia");
const tokenService = require("../module/jwt");
const {detectCountry} = require("../module/detectCountry");

const uuid4 = require("uuid4");

router.get('/nice/callback', async (req, res) => {
  const { token_version_id, enc_data, integrity_value } = req.query;
  const clientOrigin = process.env.FRONTEND_URL;
  
  try {
    const niceAuth = new NiceAuth();
    const accessToken = await niceAuth.getAccessToken();
    
    const result = await niceAuth.getCertificationResult(
      accessToken,
      token_version_id,
      enc_data, 
      integrity_value
    );

    const safeResult = {
      success: true,
      authStatus: result.dataHeader.GW_RSLT_CD,
      userInfo: {
        name: result.dataBody.name,
        birthDate: result.dataBody.birthdate,
        gender: result.dataBody.gender,
        nationality: result.dataBody.nationality
      }
    };

    res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>인증 처리 중</title>
          <script>
            window.opener.postMessage(${JSON.stringify(safeResult)}, "${clientOrigin}");
            setTimeout(() => window.close(), 1000);
          </script>
        </head>
        <body>
          <p>인증이 완료되었습니다. 잠시만 기다려주세요...</p>
        </body>
      </html>
    `);
    
  } catch (error) {
    console.error('NICE 인증 실패:', error);
    
    res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
        </head>
        <body>
          <script>
            window.opener.postMessage({ success: false, error: "인증 실패" }, "${clientOrigin}");
            setTimeout(() => window.close(), 1000);
          </script>
          <p>인증에 실패했습니다. 창이 곧 닫힙니다...</p>
        </body>
      </html>
    `);
  }
});

// 로그인 프로세스
router.post("/login", function (request, response) {
  const id = request.body.id;
  const user_id = request.body.user_id;
  const password = request.body.password;

  if (user_id && password) {
    // id와 pw가 입력되었는지 확인
    db.query(
      "SELECT * FROM users WHERE user_id = ?",
      [user_id],
      function (error, results, fields) {
        if (error) throw error;

        if (results.length === 0) {
          // user_id가 존재하지 않을 때
          return response
            .status(404)
            .send({message: "해당 아이디가 존재하지 않습니다.", status: 404});
        }

        // user_id가 존재할 경우 비밀번호 확인
        const user = results[0];

        if (user.password !== password) {
          // 비밀번호가 틀릴 때
          return response
            .status(400)
            .send({message: "비밀번호가 틀립니다.", status: 400});
        }
        // 로그인 성공
        request.session.is_logined = true; // 세션 정보 갱신
        request.session.nickname = user_id;
        request.session.id = id;

        response.status(200).send({
          message: "로그인이 완료되었습니다.",
          accessToken: tokenService.getToken({
            user_id: user.user_id,
            id: user.id,
            is_admin: user.is_admin,
          }),
          status: 200,
          user_id: user.user_id,
          username: user.username,
          description: user.description,
          profile_image: user.profile_image,
          background_image: user.background_image,
          is_adult_verified: user.is_adult_verified,
          is_admin: user.is_admin,
          is_uploader: user.is_uploader,
          bloom: user.bloom,
        });
      }
    );
  } else {
    response
      .status(400)
      .send({message: "아이디와 비밀번호를 입력하세요.", status: 400});
  }
});

// 로그아웃
router.post("/logout", function (request, response) {
  request.session.destroy((err) => {
    if (err) {
      return response
        .status(500)
        .send({message: "로그아웃 중 오류가 발생했습니다."});
    }
    response.status(200).send({message: "로그아웃되었습니다."});
  });
});

// 회원가입 프로세스
router.post("/signup", function (request, response) {
  const user_id = request.body.user_id;
  const password = request.body.password;
  const passwordCheck = request.body.passwordCheck;
  const username = request.body.username;

  if (user_id && password && passwordCheck && username) {
    // username 체크 추가
    // user_id 중복 확인
    db.query(
      "SELECT * FROM users WHERE user_id = ? OR username = ?", // user_id와 username 둘 다 확인
      [user_id, username],
      function (error, results, fields) {
        if (error) throw error;

        // user_id와 username 중복 확인
        if (results.length <= 0 && password === passwordCheck) {
          // DB에 같은 이름의 회원아이디와 닉네임이 없고, 비밀번호가 올바르게 입력된 경우
          db.query(
            "INSERT INTO users (user_id, password, username) VALUES(?,?,?)",
            [user_id, password, username],
            function (error, data) {
              if (error) throw error;
              response.status(200).send("회원가입이 완료되었습니다!");
            }
          );
        } else if (results.length > 0) {
          // user_id 또는 username이 이미 존재하는 경우
          if (results[0].user_id === user_id) {
            response.status(409).send("이미 존재하는 아이디 입니다.");
          } else if (results[0].username === username) {
            response.status(409).send("이미 존재하는 닉네임 입니다.");
          }
        } else if (password !== passwordCheck) {
          // 비밀번호가 올바르게 입력되지 않은 경우
          response.status(400).send("입력된 비밀번호가 서로 다릅니다.");
        }
      }
    );
  } else {
    // 입력되지 않은 정보가 있는 경우
    response.status(400).send("입력되지 않은 정보가 있습니다.");
  }
});

// 토큰 검증 API 엔드포인트
router.get("/validate-token", authenticateToken, function (req, res) {
  // 토큰이 유효하면 사용자 정보를 조회
  db.query(
    "SELECT * FROM users WHERE user_id = ?",
    [req.user.user_id],
    function (error, results) {
      if (error) {
        return res.status(500).json({
          valid: false,
          message: "서버 오류가 발생했습니다.",
        });
      }

      if (results.length === 0) {
        return res.status(404).json({
          valid: false,
          message: "사용자를 찾을 수 없습니다.",
        });
      }

      const user = results[0];

      // 유효성 검증 성공 및 사용자 정보 반환
      res.status(200).json({
        valid: true,
        message: "유효한 토큰입니다.",
        user_id: user.user_id,
        username: user.username,
        description: user.description,
        profile_image: user.profile_image,
        background_image: user.background_image,
        is_adult_verified: user.is_adult_verified,
        is_admin: user.is_admin,
        is_uploader: user.is_uploader,
        bloom: user.bloom,
      });
    }
  );
});

// 국가 코드와 언어 매핑
const countryToLanguage = {
  KR: "ko",
  JP: "jp",
  CN: "zh",
  TW: "zh",
  US: "en",
  GB: "en",
  // 추가 국가 매핑
};

// 단일 사용자 정보 조회 API
router.get("/user/:id", (req, res) => {
  const userId = req.params.id;
  const sql = `
    SELECT 
      id,
      username,
      description,
      created_at,
      updated_at, 
      is_adult_verified, 
      is_admin,
      is_uploader,
      profile_image,
      background_image,
      adult_verified_at
      bloom
    FROM users 
    WHERE id = ?
  `;

  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error("사용자 정보 조회 실패:", err);
      return res.status(500).send({message: "서버 오류가 발생했습니다."});
    }

    // 결과가 없는 경우
    if (results.length === 0) {
      return res.status(404).send({
        status: "error",
        message: "해당 사용자를 찾을 수 없습니다.",
      });
    }

    // 첫 번째 결과 반환 (id는 기본키이므로 항상 하나의 결과만 존재)
    res.send({
      status: "success",
      data: results[0],
    });
  });
});

router.get("/uploaders", (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  // 업로더 정보를 가져오는 메인 쿼리
  const uploaderQuery = `
    SELECT 
      u.id,
      u.user_id,
      u.username,
      u.description,
      u.created_at,
      u.profile_image,
      u.background_image,
      u.bloom,
      COUNT(DISTINCT m.id) as media_count,
      COALESCE(SUM(m.views), 0) as total_views,
      COALESCE(MAX(m.created_at), u.created_at) as last_upload
    FROM users u
    LEFT JOIN medias m ON u.id = m.uploader_id
    WHERE u.is_uploader = 1
    GROUP BY 
      u.id,
      u.user_id,
      u.username,
      u.description,
      u.created_at, 
      u.profile_image,
      u.background_image,
      u.bloom
    ORDER BY last_upload DESC
    LIMIT ? OFFSET ?
  `;

  // 전체 업로더 수 쿼리
  const countQuery = `
    SELECT COUNT(DISTINCT id) as total 
    FROM users 
    WHERE is_uploader = 1
  `;

  db.query(uploaderQuery, [limit, offset], (err, uploaders) => {
    if (err) {
      console.error("업로더 목록 조회 실패:", err);
      return res.status(500).send({
        status: "error",
        message: "서버 오류가 발생했습니다.",
      });
    }

    db.query(countQuery, (err, countResult) => {
      if (err) {
        console.error("업로더 수 조회 실패:", err);
        return res.status(500).send({
          status: "error",
          message: "서버 오류가 발생했습니다.",
        });
      }

      const totalCount = countResult[0].total;
      const totalPages = Math.ceil(totalCount / limit);

      res.send({
        status: "success",
        data: uploaders.map((uploader) => ({
          ...uploader,
          media_count: parseInt(uploader.media_count) || 0,
          total_views: parseInt(uploader.total_views) || 0,
          last_upload: uploader.last_upload,
        })),
        pagination: {
          current_page: page,
          total_pages: totalPages,
          total_count: totalCount,
          per_page: limit,
        },
      });
    });
  });
});

router.get("/recommended-uploaders", authenticateToken, (req, res) => {
  const userId = req.user.id; // 현재 로그인한 사용자 ID

  const limit = parseInt(req.query.limit) || 3; // 기본값으로 3명의 업로더 추천

  // 팔로우하지 않은 업로더를 랜덤으로 조회하는 쿼리
  const recommendQuery = `
    SELECT 
      u.id,
      u.user_id,
      u.username,
      u.description,
      u.profile_image,
      u.background_image,
      u.bloom,
      COUNT(DISTINCT m.id) as media_count,
      COALESCE(SUM(m.views), 0) as total_views,
      COALESCE(MAX(m.created_at), u.created_at) as last_upload
    FROM users u
    LEFT JOIN medias m ON u.id = m.uploader_id
    WHERE u.is_uploader = 1
    AND u.id != ?  /* 자기 자신 제외 */
    AND u.id NOT IN (  /* 이미 팔로우한 업로더 제외 */
      SELECT following_id 
      FROM follows 
      WHERE follower_id = ?
    )
    GROUP BY 
      u.id,
      u.user_id,
      u.username,
      u.description,
      u.profile_image,
      u.background_image,
      u.bloom
    ORDER BY RAND()  /* 랜덤 정렬 */
    LIMIT ?
  `;

  db.query(recommendQuery, [userId, userId, limit], (err, uploaders) => {
    if (err) {
      console.error("추천 업로더 조회 실패:", err);
      return res.status(500).send({
        status: "error",
        message: "서버 오류가 발생했습니다.",
      });
    }

    res.send({
      status: "success",
      data: uploaders.map((uploader) => ({
        ...uploader,
        media_count: parseInt(uploader.media_count) || 0,
        total_views: parseInt(uploader.total_views) || 0,
        last_upload: uploader.last_upload,
      })),
    });
  });
});

// 팔로우 관련 API

// 팔로우하기
router.post("/follow/:uploaderId", authenticateToken, async (req, res) => {
  const followerId = req.user.id; // 현재 로그인한 사용자 ID (인증 미들웨어에서 설정됨을 가정)
  const uploaderId = parseInt(req.params.uploaderId);

  // 자기 자신을 팔로우하는 것을 방지
  if (followerId === uploaderId) {
    return res.status(400).send({
      status: "error",
      message: "자기 자신을 팔로우할 수 없습니다.",
    });
  }

  // 업로더인지 확인
  const uploaderCheckQuery = "SELECT is_uploader FROM users WHERE id = ?";

  db.query(uploaderCheckQuery, [uploaderId], (err, results) => {
    if (err) {
      console.error("업로더 확인 실패:", err);
      return res.status(500).send({
        status: "error",
        message: "서버 오류가 발생했습니다.",
      });
    }

    if (results.length === 0 || !results[0].is_uploader) {
      return res.status(400).send({
        status: "error",
        message: "유효한 업로더가 아닙니다.",
      });
    }

    // 팔로우 관계 생성
    const followQuery =
      "INSERT INTO follows (follower_id, following_id) VALUES (?, ?)";

    db.query(followQuery, [followerId, uploaderId], (err) => {
      if (err) {
        // 중복 팔로우 시도 시
        if (err.code === "ER_DUP_ENTRY") {
          return res.status(400).send({
            status: "error",
            message: "이미 팔로우하고 있는 업로더입니다.",
          });
        }
        console.error("팔로우 생성 실패:", err);
        return res.status(500).send({
          status: "error",
          message: "서버 오류가 발생했습니다.",
        });
      }

      res.send({
        status: "success",
        message: "성공적으로 팔로우했습니다.",
      });
    });
  });
});

// 언팔로우하기
router.delete("/follow/:uploaderId", authenticateToken, (req, res) => {
  const followerId = req.user.id; // 현재 로그인한 사용자 ID
  const uploaderId = parseInt(req.params.uploaderId);

  const unfollowQuery =
    "DELETE FROM follows WHERE follower_id = ? AND following_id = ?";

  db.query(unfollowQuery, [followerId, uploaderId], (err, result) => {
    if (err) {
      console.error("언팔로우 실패:", err);
      return res.status(500).send({
        status: "error",
        message: "서버 오류가 발생했습니다.",
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).send({
        status: "error",
        message: "팔로우 관계가 존재하지 않습니다.",
      });
    }

    res.send({
      status: "success",
      message: "성공적으로 언팔로우했습니다.",
    });
  });
});

// 팔로잉 목록 조회
router.get("/following", authenticateToken, (req, res) => {
  const userId = req.user.id;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  const followingQuery = `
    SELECT 
      u.id,
      u.user_id,
      u.username,
      u.description,
      u.profile_image,
      u.background_image,
      u.bloom,
      f.created_at as followed_at,
      COUNT(DISTINCT m.id) as media_count,
      COALESCE(SUM(m.views), 0) as total_views
    FROM follows f
    JOIN users u ON f.following_id = u.id
    LEFT JOIN medias m ON u.id = m.uploader_id
    WHERE f.follower_id = ?
    GROUP BY 
      u.id,
      u.user_id,
      u.username,
      u.description,
      u.profile_image,
      u.background_image,
      u.bloom,
      f.created_at
    ORDER BY f.created_at DESC
    LIMIT ? OFFSET ?
  `;

  const countQuery = `
    SELECT COUNT(*) as total
    FROM follows
    WHERE follower_id = ?
  `;

  db.query(followingQuery, [userId, limit, offset], (err, following) => {
    if (err) {
      console.error("팔로잉 목록 조회 실패:", err);
      return res.status(500).send({
        status: "error",
        message: "서버 오류가 발생했습니다.",
      });
    }

    db.query(countQuery, [userId], (err, countResult) => {
      if (err) {
        console.error("팔로잉 수 조회 실패:", err);
        return res.status(500).send({
          status: "error",
          message: "서버 오류가 발생했습니다.",
        });
      }

      const totalCount = countResult[0].total;
      const totalPages = Math.ceil(totalCount / limit);

      res.send({
        status: "success",
        data: following.map((user) => ({
          ...user,
          media_count: parseInt(user.media_count) || 0,
          total_views: parseInt(user.total_views) || 0,
        })),
        pagination: {
          current_page: page,
          total_pages: totalPages,
          total_count: totalCount,
          per_page: limit,
        },
      });
    });
  });
});

// 기본 언어 설정
const DEFAULT_LANGUAGE = "ko";

router.get("/user-country", detectCountry, (req, res) => {
  console.log(req.geoInfo);

  try {
    const geoInfo = req.geoInfo;
    const countryCode = geoInfo?.country || "";
    const language = countryToLanguage[countryCode] || DEFAULT_LANGUAGE;

    res.json({
      success: true,
      data: {
        ip: req.ip,
        countryCode,
        language,
        region: geoInfo?.region || "",
        timezone: geoInfo?.timezone || "",
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to detect country",
    });
  }
});

module.exports = router;
