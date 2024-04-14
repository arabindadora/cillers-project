# !/bin/zsh
set -o errexit

apt-get update
apt-get install -y wget unzip

# Download the data
wget -O /tmp/data.zip https://github.com/PokeAPI/pokeapi/archive/refs/heads/master.zip

# Unzip the data
unzip /tmp/data.zip -d /tmp

# Move the data to the correct location
mv /tmp/pokeapi-master/data/v2/csv /data

# loop though the csv files
for file in /data/*.csv
do
    filename="$(basename $file .csv)"
    # create a couchbase collection under 'cillers' bucket '_default' scope <filename> collection
    cbq -e http://couchbase:8091 -u admin -p password -s "CREATE COLLECTION cillers._default.${filename} IF NOT EXISTS ;"

    # sleep 5 seconds
    sleep 1

    # create a primary index on the collection on 'id' column
    cbq -e http://couchbase:8091 -u admin -p password -s "CREATE PRIMARY INDEX IF NOT EXISTS ON cillers._default.${filename} ;"

    # import data onto the collection
    cbimport csv --infer-types -c http://couchbase:8091 -u admin -p password -b 'cillers' -d file://$file -g "#UUID#" --scope-collection-exp "_default.${filename}"

done