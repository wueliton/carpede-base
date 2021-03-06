/* eslint-disable camelcase */
import React, { useContext, useState } from 'react';
import { useRoute, useNavigation } from '@react-navigation/native';
import { View, SafeAreaView, Text, Linking } from 'react-native';
import OrderContext from '../../contexts/order';

import { treatPrice } from '../../utils/treatStrings';

import styles, { Theme } from '../../global';
import { Header } from '../../components/Header';
import { ListOrderItems } from '../../components/Lists';
import { Button, OutlineButton } from '../../components/Elements';
import { ModalView } from '../../components/Structures';

const Order = () => {
  const {
    params: {
      data: {
        date,
        order_id,
        paymentMethod,
        status,
        time,
        value,
        fees,
        products,
      },
    },
  } = useRoute();
  const { storeInfo } = useContext(OrderContext);
  const { goBack } = useNavigation();

  const [modalVisible, setModalVisible] = useState(false);

  return (
    <>
      <SafeAreaView style={styles.container}>
        <Header iconLeft="arrow-left" actionLeft={goBack} />
        <View style={styles.column}>
          <Text style={styles.title}>#{order_id.toUpperCase()}</Text>
          <Text style={styles.subtitle}>
            {status === 'waiting' && 'Aguardando Entrega'}
            {status === 'done' && 'Pedido Entregue'}
          </Text>
          <Text style={styles.medium}>
            {date} ás {time}
          </Text>
        </View>
        <ListOrderItems data={products} locked />
        <View style={styles.footerOrder}>
          <View style={styles.spaceBetween}>
            {paymentMethod.money && (
              <>
                <Text style={styles.medium}>Troco para: </Text>
                <Text style={styles.light}>
                  {treatPrice(paymentMethod.money.amount)}
                </Text>
              </>
            )}
            {paymentMethod.card && (
              <>
                <Text style={styles.medium}>Método: </Text>
                <Text style={styles.light}>
                  Cartão de
                  {paymentMethod.card.method === 'credit' && ' Crédito'}
                  {paymentMethod.card.method === 'debit' && ' Dédito'}
                </Text>
              </>
            )}
          </View>
          <View style={styles.spaceBetween}>
            <Text style={styles.medium}>Taxas: </Text>
            <Text style={styles.light}>
              {treatPrice(fees.payment + fees.delivery)}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingBottom: 16,
              borderBottomColor: Theme.background2,
              borderBottomWidth: 1,
              marginBottom: 16,
            }}
          >
            <Text style={styles.bold}>Total do pedido: </Text>
            <Text style={styles.boldSubtitle}>{treatPrice(value)}</Text>
          </View>
          <Button
            title="Falar com um Atendente"
            action={() => setModalVisible(true)}
          />
        </View>
      </SafeAreaView>
      <ModalView show={modalVisible} closeAction={() => setModalVisible(false)}>
        <View style={styles.column}>
          <View style={{ paddingBottom: 16 }}>
            <Text style={styles.boldSubtitle}>Quer falar por onde?</Text>
          </View>
          <OutlineButton
            icon="whatsapp"
            title="Whatsapp"
            action={() => {
              Linking.openURL(
                `whatsapp://send?text=Pedido ${order_id.toUpperCase()} &phone=55${
                  storeInfo.whatsapp
                }`
              );
            }}
          />
          <OutlineButton
            icon="phone"
            title="Telefone"
            action={() => {
              Linking.openURL(`tel:${storeInfo.phone}`);
            }}
          />
        </View>
      </ModalView>
    </>
  );
};

export default Order;
