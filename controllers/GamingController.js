const { Router } = require('express');
const Games = require('../db').import('../models/Gaming');
const validateSession = require('../middleware/validateJWT');

const gamingController = Router();

gamingController.post('/test', function(req, res) {
    res.send("Successful Test Run??")
});

//MyReviews Route
gamingController.get('/myreviews', validateSession, (req, res) => {
    Games.findAll({
        where: { owner_id: req.user.id }
    })
    .then(games => res.status(200).json(games))
    .catch(err => res.status(500).json({ error: err }));
});


// gamingController.get('/myreviews', async (req, res) =>{
//     try{
//         const reviews = await Games.findAll({
//             where: {
//                 owner_id: req.user.id,
//             },
//         });
//         if (reviews) {
//             res.status(200).json({
//                 results: reviews
//             });
//         } else {
//             res.status(404).json({
//                 message: "No reviews found for user",
//             });
//         }
//     } catch (e) {
//         res.status(500).message({
//             message: "Failed to retrieve reviews for user",
//         });
//     }
// });

//Review Route
// gamingController.post('/review', function(req, res) {
//     console.log(req.body);

//     let owner_id = req.user.id;
//     let title = req.body.Games.title;
//     let platform = req.body.Games.platform;
//     let rating = req.body.Games.rating;
//     let review = req.body.Games.review;

//     Games.create({
//         owner_id: owner_id,
//         title: title,
//         platform: platform,
//         rating: rating,
//         review: review
//     })
//     .then(
//         function createSuccess(newTitle) {
//             res.json({
//                 title: title
//             });
//         },
//         function createError(err) {
//             res.send(500, err.message);
//         }
//     );
// });

gamingController.post('/review', validateSession, (req, res) => {
    let gamingReview = {
      owner_id: req.user.id,
      title: req.body.title,
      platform: req.body.platform,
      rating: req.body.rating,
      review: req.body.review
    };
    Games.create(gamingReview)
      .then(games => res.status(200).json(games))
      .catch(err => res.json(err.message));
  });

//Edit Reviews Route
gamingController.get('/:id', (req, res) => {
    Games.findOne({
        where: {
            id: req.params.id,
            owner_id: req.user.id
        }
    })
    .then(games => res.status(200).json(games))
    .catch(err => res.status(500).json({ error: err }));
});

gamingController.put('/:id', validateSession, (req, res) => {
    Games.update(req.body, {
        where: {
            id: req.params.id,
            owner_id: req.user.id
        }
    })
    .then(
        (updateSuccess = games => {
            res.json({
                games: games,
                message: "Successful Update!"
            });
        })
    )
    .catch(err => res.status(500).json({ error: err }));
});

//Delete Reviews Route
gamingController.delete('/:id', validateSession, (req, res) => {
    let userid = req.user.id;
    let data = req.params.id;
    Games.destroy({
        where: {
            owner_id: userid,
            id: data
        }
    }).then(
        (deleteGames = gamingReview => {
            res.send("Review successfully deleted!");
        }),
        (deleteError = err => {
            res.send(500, err.message);
        })
    );
});

// gamingController.delete('/delete', function (req, res) {
//     const data = req.params.id;
//     const owner_id = req.user.id;

//     Games.destroy({
//         where: { 
//             id: data, 
//             owner_id: owner_id
//         }
//     }).then (
//         function deleteReviewSuccess(data){
//             res.send("Review was successfully deleted!")
//         },
//         function deleteReviewError(err){
//             res.send(500, err.message);
//         }
//     ); 
// });

//Admin Delete Review Function
// gamingController.delete('/admin:id', (req, res) => {
//     if (req.user.admin === true) {
//     Games.destroy({
//         where: { 
//             id: data, 
//             owner_id: owner_id
//         }
//     }).then (
//         function deleteReviewSuccess(data){
//             res.send("Sorry, Lord Sauron has confiscated this content!")
//         },
//         function deleteReviewError(err){
//             res.send(500, err.message);
//         }
//     )}; 
// });

module.exports = gamingController;