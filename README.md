# Frontend Part

## 15.0 Local only fields

## 15.18 Header part Two

- Apollo cache

query me를 날리는 useMe custom hook을 만들고, 그것을 router에서 부르고 header에서 또 한번 부르면 graphql query가 두번 실행될까? 그렇지 않다. 똑같은 쿼리를 다시 날릴 때 Apollo Client는 query를 보내는 대신 cache에서 값을 찾아 보내준다.
아주 큰 장점이지만 경우에 따라서는 매번 새 쿼리를 날리도록 만들어줄 필요가 있을 것 같다.
