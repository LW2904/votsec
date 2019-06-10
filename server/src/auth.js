const config = require('../../config');
const OktaJwtVerifier = require('@okta/jwt-verifier');

const requireAuth = exports.requireAuth = (fastify, requiredGroup) => {
	const verifier = new OktaJwtVerifier({
		clientId: config.openID.client,
		issuer: config.openID.issuer,
		assertClaims: config.resourceServer.assertClaims,
	});

	return async (request, reply, done) => {
		const authHeader = request.headers.authorization || '';
		const match = authHeader.match(/Bearer (.+)/);

		fastify.assert(match && match[1], 400,
			'Malformed or missing authentication header');

		try {
			const token = await verifier.verifyAccessToken(match[1]);
			const { grp } = token.claims;

			if (!grp && requiredGroup) {
				reply.forbidden('Groups required but not found');
			}

			fastify.assert(grp.includes(requiredGroup), 403)
		} catch (err) {
			fastify.log.trace(err);

			reply.forbidden('Invalid token');
		}

		done();
	};
};