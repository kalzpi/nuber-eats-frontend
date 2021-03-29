# Frontend Part

## 15.0 Local only fields

## 15.18 Header part Two

- Apollo cache

query me를 날리는 useMe custom hook을 만들고, 그것을 router에서 부르고 header에서 또 한번 부르면 graphql query가 두번 실행될까? 그렇지 않다. 똑같은 쿼리를 다시 날릴 때 Apollo Client는 query를 보내는 대신 cache에서 값을 찾아 보내준다.
아주 큰 장점이지만 경우에 따라서는 매번 새 쿼리를 날리도록 만들어줄 필요가 있을 것 같다.

## 16.4 writeFragment vs Refetch

- writeFragment

```typescript
const {
  me: { email: prevEmail, id },
} = userData;
const { email: newEmail } = getValues();
if (prevEmail !== newEmail) {
  client.writeFragment({
    id: `User:${id}`,
    fragment: gql`
      fragment EditedUser on User {
        email
        isVerified
      }
    `,
    data: {
      email: newEmail,
      isVerified: false,
    },
  });
}
```

Backend에 Mutation을 할 때, 실제로는 data에 변화가 일어났지만 Apollo는 cache에 있는 값을 읽어오기 때문에 업데이트 되지 않는다. 따라서 위와 같이 Backend로부터 success신호(이 경우에는 ok:true)를 받은 뒤 onCompleted 함수에 if(ok) 조건 하에 backend에 업데이트 한 내용을 cache에 직접 작성해주면 다시 api call을 하지 않고 로딩 없이 frontend에 보여지는 데이터를 변경 가능하다.

- Refetch

```typescript
await refetch();
```

위와 같이 하는 대신, 단순히 refetch하는 것으로 old cache를 불러오는 것을 막을 수 있다.

- Better way?

Frontend에 표시해야 할 내용이 다수의 사용자를 통해 실시간으로 업데이트 되는 것이라면 refetch하는 것이 좋다. 예를 들어 Youtube의 '좋아요' 버튼을 눌렀을 때 단순히 cache에서 count += 1 하는 것은 문제가 있다. 그 동안 남들이 누른 좋아요의 수와 다르기 때문이다.

하지만 구독 버튼의 경우 '구독함' '구독하지 않음' 은 나 혼자만 보는 내용이므로 cache를 업데이트 하는 것이 좋다.
