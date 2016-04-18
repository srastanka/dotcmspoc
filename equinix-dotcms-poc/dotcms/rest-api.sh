#!/bin/sh

# you must change the agent_uniqueUri each time you run the script, since that field must be unique
agent_uniqueUri=Agent7
profile_image="profileimage=/contentAsset/raw-data/1b75bca0-b0df-47fb-869e-7dca7c66d7cb/profileimage"	# this will not work, get error on create
profile_image="profileimageContentAsset=1b75bca0-b0df-47fb-869e-7dca7c66d7cb/profileimage"	# this will be ignored
profile_image="email=testing@mortgagealliance.com"

# variables
tmpfile=/tmp/rest-api.txt
tmpfile2=/tmp/update-rest-api.txt
dev_dotcms_url="http://dev.tmacc.com:8080/api/content"
ovi_dotcms_url="http://ovi-dotcms-dev.cloudapp.net:8080/api/content"
dev_authentication="-u admin@dotcms.com:admin"
url_encoded="-H Content-Type:application/x-www-form-urlencoded"
agent_stInode="5395a23a-4881-4aab-9e60-c04e7bcb6d99"

system_host="SYSTEM_HOST"
tmacc_host="d653d47e-d2cb-4068-8832-92e84fb74e1c"

test_url=$ovi_dotcms_url
test_url=$dev_dotcms_url

#curl -v "$test_url/id/6b9c319e-f850-453a-86a2-491a5f49dc20"
#curl -v "$test_url/id/11ae2a6f-128f-4185-b5f3-d8e4240c31e8"

echo create an agent named $agent_uniqueUri:
curl -v $dev_authentication $url_encoded -XPOST "$test_url/publish/1" -d \
	"stInode=$agent_stInode&uniqueuri=$agent_uniqueUri&firstname=$agent_uniqueUri&lastname=TMACC&active=1&bossid=1246$agent_uniqueUri&$profile_image" > $tmpfile 2>&1

# use sed to strip trailing \r from curl output
response=`grep '< HTTP/1.1' $tmpfile`
new_inode=`grep inode: $tmpfile | awk '{print $3}' | sed s///`
new_identifier=`grep identifier: $tmpfile | awk '{print $3}' | sed s///`
if test -n "$new_inode"; then
	echo success, response: $response
else
	echo failed to create agent, error: $response
	exit 1
fi
echo new inode is $new_inode and identifier is $new_identifier my friend

echo query for agent
curl "$test_url/query/+contentType:Agent%20+Agent.uniqueuri:$agent_uniqueUri" > /tmp/agent.before

echo update lastname and franchiseID fields
#curl -v $dev_authentication $url_encoded -XPUT "$test_url/publish/1" -d "identifier=$new_identifier&stInode=$agent_stInode&uniqueuri=$agent_uniqueUri&firstname=$agent_uniqueUri&lastname=TMACC%20updated&franchiseid=9" > $tmpfile2 2>&1
curl -v $dev_authentication $url_encoded -XPUT "$test_url/publish/1" -d "identifier=$new_identifier&stInode=$agent_stInode&lastname=foo&franchiseid=9" > $tmpfile2 2>&1

echo query for agent after update
curl "$test_url/query/+contentType:Agent%20+Agent.uniqueuri:$agent_uniqueUri" > /tmp/agent.after
cat /tmp/agent.after

#echo query for agent named Mona:
#curl -v "http://ovi-dotcms-dev.cloudapp.net:8080/api/content/query/+contentType:Agent%20+Agent.firstname:*mona*"
