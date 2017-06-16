post install instructions
https://github.com/andpor/react-native-sqlite-storage

table:

```sql
CREATE TABLE `request` (
	`id`	TEXT NOT NULL UNIQUE,
	`params`	TEXT,
	`response`	TEXT
);
```