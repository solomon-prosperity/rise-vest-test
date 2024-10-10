import BaseRepository from "./BaseRepository";

class UserRepository extends BaseRepository {
  table: string;
  tableId: string;
  constructor() {
    super("users");
    this.table = "users";
    this.tableId = "userId";
  }

  getUserById(): string {
    return this.getByCol()(this.tableId);
  }

  getUserByCol(col: string): string {
    return this.getByCol()(col);
  }

  createUser(): string {
    return `insert into ${this.table}(first_name,last_name,email,password,gender,created_on)
        values ($1,$2,$3,$4,$5,NOW()) returning *;`;
  }

  getTopUsersWithMostPosts(): string {
    return `WITH RatedComments AS (
        SELECT
          comments.*,
          ROW_NUMBER() OVER (PARTITION BY postId ORDER BY created_on DESC) AS comment_rank
        FROM
          comments
    )
    SELECT
      users.id,
      users.first_name,
      users.last_name,
      posts.post,
      RatedComments.comment
    FROM
      users
    LEFT JOIN (
        SELECT
          posts.*,
          ROW_NUMBER() OVER (PARTITION BY userId ORDER BY created_on DESC) AS post_rank
        FROM
          posts
    ) AS posts ON users.id = posts.userId AND posts.post_rank = 1
    LEFT JOIN (
        SELECT
          users.id AS user_id,
          COUNT(posts.postId) AS post_count
        FROM
          users
        LEFT JOIN
          posts ON users.id = posts.userId
        GROUP BY
          users.id
    ) AS user_post_counts ON users.id = user_post_counts.user_id
    LEFT JOIN
      RatedComments ON posts.postId = RatedComments.postId AND RatedComments.comment_rank = 1
    ORDER BY
      user_post_counts.post_count DESC
    LIMIT 3;
    `;
  }
}

export default UserRepository;
