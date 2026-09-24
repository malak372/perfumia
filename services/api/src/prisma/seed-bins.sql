INSERT INTO "public"."bin"
(
  "id",
  "code",
  "row",
  "column",
  "markerType",
  "markerValue",
  "quantity",
  "reservedQuantity",
  "createdAt",
  "updatedAt"
)
VALUES
(gen_random_uuid(), 'B1',  1, 1, 'ARUCO', '1',  0, 0, now(), now()),
(gen_random_uuid(), 'B2',  1, 2, 'ARUCO', '2',  0, 0, now(), now()),
(gen_random_uuid(), 'B3',  1, 3, 'ARUCO', '3',  0, 0, now(), now()),
(gen_random_uuid(), 'B4',  1, 4, 'ARUCO', '4',  0, 0, now(), now()),

(gen_random_uuid(), 'B5',  2, 1, 'ARUCO', '5',  0, 0, now(), now()),
(gen_random_uuid(), 'B6',  2, 2, 'ARUCO', '6',  0, 0, now(), now()),
(gen_random_uuid(), 'B7',  2, 3, 'ARUCO', '7',  0, 0, now(), now()),
(gen_random_uuid(), 'B8',  2, 4, 'ARUCO', '8',  0, 0, now(), now()),

(gen_random_uuid(), 'B9',  3, 1, 'ARUCO', '9',  0, 0, now(), now()),
(gen_random_uuid(), 'B10', 3, 2, 'ARUCO', '10', 0, 0, now(), now()),
(gen_random_uuid(), 'B11', 3, 3, 'ARUCO', '11', 0, 0, now(), now()),
(gen_random_uuid(), 'B12', 3, 4, 'ARUCO', '12', 0, 0, now(), now()),

(gen_random_uuid(), 'B13', 4, 1, 'ARUCO', '13', 0, 0, now(), now()),
(gen_random_uuid(), 'B14', 4, 2, 'ARUCO', '14', 0, 0, now(), now()),
(gen_random_uuid(), 'B15', 4, 3, 'ARUCO', '15', 0, 0, now(), now()),
(gen_random_uuid(), 'B16', 4, 4, 'ARUCO', '16', 0, 0, now(), now())

ON CONFLICT ("code")
DO UPDATE SET
  "row" = EXCLUDED."row",
  "column" = EXCLUDED."column",
  "markerType" = EXCLUDED."markerType",
  "markerValue" = EXCLUDED."markerValue",
  "updatedAt" = now();