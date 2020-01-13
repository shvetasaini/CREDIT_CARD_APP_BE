const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const IsJsonString = (str) =>{
  try {
    JSON.parse(str);
    return true;
  }
  catch(e){return false;}
}

//Get api
const getCrediCards = async (req, res, next) => {
  try {
    const creditCardsStringify = fs.readFileSync(path.join(__dirname, './credit-cards.json'));
    const creditCards = IsJsonString(creditCardsStringify)?JSON.parse(creditCardsStringify):[];

    if (!creditCards) {
      const err = new Error("Records are not found");
      err.status = 404;
      throw err;
    }
    else creditCards.sort((a,b)=>{return +b.id - +a.id});

    res.json(creditCards);
  } catch (e) {next(e);}
};

//Post api
const postCrediCard = async (req, res, next) => {
  try {
    let id=101;
    const crediCadFilePath=path.join(__dirname,'./credit-cards.json');
    const creditCardsStringify = fs.readFileSync(crediCadFilePath);
    const creditCards = IsJsonString(creditCardsStringify) ? JSON.parse(creditCardsStringify):[];
    
    if(creditCards.length>0)
    {
      creditCards.sort((a,b)=>{return b.id-a.id;});
      id = +creditCards[0].id + 1;
    }
    console.log(req);

    const newCreditCard={
      "id":id,
      "cardName":req.body.cardName,
      "cardNumber":req.body.cardNumber,
      "cardLimit":req.body.cardLimit
    };

    creditCards.push(newCreditCard);
    fs.writeFileSync(crediCadFilePath,JSON.stringify(creditCards)); 
    
    res.status(201).json(newCreditCard);
  } catch (e) {next(e);}
};

router
  .route('/api/creditcards')
  .get(getCrediCards);

  router
  .route('/api/creditcards')
  .post(postCrediCard);

module.exports = router;
