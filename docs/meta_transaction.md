![meta-transaction](./diagrams/meta-transaction.excalidraw.svg)

Steps to execute meta-transaction

1. Vendor creates a meta-transaction and signs it with its private key.
2. Vendor sends the meta-transaction signature to the rahat-platform.
3. Rahat-platform add meta-transaction request to the queue.
4. Meta-transaction queue worker will execute the meta-transaction requests serially.

How to deal with the db updates to be done after the meta-transaction is executed?

To handle the database updates after a meta transaction , we need to provide the payload and trigger event along with the meta transaction.
Format:

```
{
action:
payload:{
metatx:
}
trigger:{
projectUuid: "",
event_name:””,
payload:””
}
}
```

After successful completion of a transaction,an event mentioned in the payload is emitted and based on the event name project actions are called.

During addition of the meta tx in the queue, initially txnHash is calculated and returned to the vendor app

In vendor app:
After receiving the txHash value from backend all the pending transaction status is updated to inProgress.
After successfully listing the transaction from subgraph pending transactions status is updated to success and listed in the transaction page.
If transaction status is not updated within 24 hrs than the pending transactions are added to our project database.

<b>
Note:In backend side,seperate script is run to check the transaction status and updated the status in the database. Vendor app should fetch the transaction from backend and update the status in case of inProgress transactions.
</b>

<!-- Updated flow -->

In vendor app:
After transaction is initiated, the all the pending transaction is updated to inProgress.
After successful completion of a transaction, an event mentioned in the payload is emitted and based on the event name project actions are called.
If transaction status is not updated within 24 hrs than the pending transactions are added to our project database.
