const { db } = require('../util/admin');

exports.getAllInvitations = (request, response) => {
    response.set('Access-Control-Allow-Origin', '*');
    return response.json([
        {
          "invitationId": "alistairlim"
        },
        {
          "invitationId": "anita"
        },
        {
          "invitationId": "anthonylee"
        }
      ]);

	// db
	// 	.collection('invitation')
    //     .limit(3)
	// 	.get()
	// 	.then((data) => {
	// 		let invitations = [];
	// 		data.forEach((doc) => {
	// 			invitations.push({
    //                 invitationId: doc.id,
	// 			});
	// 		});
	// 		return response.json(invitations);
	// 	})
	// 	.catch((err) => {
	// 		console.error(err);
	// 		return response.status(500).json({ error: err.code});
	// 	});
};

exports.getAllGuests = (request, response) => {
    response.set('Access-Control-Allow-Origin', '*');
    return response.json([
        {
          "parentId": "alistairlim",
          "guestId": "alistairlim",
          "guestName": "Alistair Lim"
        },
        {
          "parentId": "alistairlim",
          "guestId": "hosanna",
          "guestName": "Hosanna"
        },
        {
          "parentId": "anita",
          "guestId": "anitalim",
          "guestName": "Anita Lim"
        },
        {
          "parentId": "anthonylee",
          "guestId": "anthony",
          "guestName": "Anthony Lee"
        }
      ])
	// db
	// 	.collectionGroup('guests')
    //     .limit(4)
	// 	.get()
	// 	.then((data) => {
	// 		let guests = [];
	// 		data.forEach((doc) => {
    //             var pathArray = doc.ref.path.split("/")
	// 			guests.push({
    //                 parentId: pathArray[1],
    //                 guestId: doc.id,
    //                 guestName: doc.data().Name,
    //                 attendTeaCeremony: doc.data().AttendTeaCeremony,
    //                 attendDinner: doc.data().AttendDinner,
	// 			});
	// 		});
	// 		return response.json(guests);
	// 	})
	// 	.catch((err) => {
	// 		console.error(err);
	// 		return response.status(500).json({ error: err.code});
	// 	});
};

exports.createInvitations = (request, response) => {
    var createdGuests = [];
    request.body.forEach(function(invitation) {
        invitation.guests.forEach(function(guest) {
            var guestid = guest.toLowerCase().replace(/\s/g, '');
            db.collection("invitations").doc(invitation.url).set({});
            db.collection("invitations").doc(invitation.url).collection("guests").doc(guestid).set({
                Name: guest
            })
            .then((doc)=>{
                createdGuests.add(doc);
            })
            .catch((err) => {
                response.status(500).json({ error: 'Something went wrong' });
                console.error(err);
            });
        });
    });
    return response.json(createdGuests);
};