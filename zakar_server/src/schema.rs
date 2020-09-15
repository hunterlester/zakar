table! {
    users (user_id) {
        id -> Int4,
        user_id -> Text,
        verses -> Array<Text>,
        created_at -> Timestamp,
    }
}
